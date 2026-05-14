require("dotenv").config();

const express = require("express");
const session = require("express-session");
const path = require("path");
const md5 = require("md5");

const app = express();

const connection = require("./db/connection");

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

function authMiddleware(req, res, next) {

    if (!req.session.user) {
        return res.redirect("/login");
    }

    next();
}

app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {

    const { username, email, password } = req.body;

    const encryptedPassword = md5(password);

    const sql = `
        INSERT INTO users (username, email, password)
        VALUES (?, ?, ?)
    `;

    connection.query(
        sql,
        [username, email, encryptedPassword],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Error al registrar");
            }

            res.redirect("/login");
        }
    );
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    const encryptedPassword = md5(password);

    const sql = `
        SELECT * FROM users
        WHERE username = ? AND password = ?
    `;

    connection.query(
        sql,
        [username, encryptedPassword],
        (err, results) => {

            if (err) {
                console.log(err);
                return res.send("Error");
            }

            if (results.length === 0) {
                return res.send("Credenciales incorrectas");
            }

            req.session.user = results[0];

            res.redirect("/dashboard");
        }
    );
});

app.get("/logout", (req, res) => {

    req.session.destroy(() => {
        res.redirect("/login");
    });

});

app.get("/dashboard", authMiddleware, (req, res) => {

    const userId = req.session.user.id;

    const projectsSql = `
        SELECT * FROM projects
        WHERE user_id = ?
    `;

    connection.query(projectsSql, [userId], (err, projects) => {

        if (err) {
            console.log(err);
            return res.send("Error");
        }

        const socialSql = `
            SELECT * FROM social_links
            WHERE user_id = ?
        `;

        connection.query(socialSql, [userId], (err, socialLinks) => {

            if (err) {
                console.log(err);
                return res.send("Error");
            }

            res.render("dashboard", {
                user: req.session.user,
                projects,
                socialLinks
            });

        });

    });

});

app.post("/profile/update", authMiddleware, (req, res) => {

    const { bio, email } = req.body;

    const userId = req.session.user.id;

    const sql = `
        UPDATE users
        SET bio = ?, email = ?
        WHERE id = ?
    `;

    connection.query(
        sql,
        [bio, email, userId],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Error");
            }

            req.session.user.bio = bio;
            req.session.user.email = email;

            res.redirect("/dashboard");
        }
    );

});

app.post("/projects/create", authMiddleware, (req, res) => {

    const { title, description, repo_url, live_url } = req.body;

    const userId = req.session.user.id;

    const sql = `
        INSERT INTO projects
        (title, description, repo_url, live_url, user_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    connection.query(
        sql,
        [title, description, repo_url, live_url, userId],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Error");
            }

            res.redirect("/dashboard");
        }
    );

});

app.post("/projects/delete/:id", authMiddleware, (req, res) => {

    const projectId = req.params.id;

    const userId = req.session.user.id;

    const sql = `
        DELETE FROM projects
        WHERE id = ? AND user_id = ?
    `;

    connection.query(
        sql,
        [projectId, userId],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Error");
            }

            res.redirect("/dashboard");
        }
    );

});

app.post("/social-links/create", authMiddleware, (req, res) => {

    const { platform, url } = req.body;

    const userId = req.session.user.id;

    const sql = `
        INSERT INTO social_links (platform, url, user_id)
        VALUES (?, ?, ?)
    `;

    connection.query(
        sql,
        [platform, url, userId],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Error");
            }

            res.redirect("/dashboard");
        }
    );

});

app.post("/social-links/delete/:id", authMiddleware, (req, res) => {

    const linkId = req.params.id;

    const userId = req.session.user.id;

    const sql = `
        DELETE FROM social_links
        WHERE id = ? AND user_id = ?
    `;

    connection.query(
        sql,
        [linkId, userId],
        (err, result) => {

            if (err) {
                console.log(err);
                return res.send("Error");
            }

            res.redirect("/dashboard");
        }
    );

});

app.get("/portfolio/:username", (req, res) => {

    const username = req.params.username;

    const userSql = `
        SELECT * FROM users
        WHERE username = ?
    `;

    connection.query(userSql, [username], (err, users) => {

        if (err) {
            console.log(err);
            return res.send("Error");
        }

        if (users.length === 0) {
            return res.send("Usuario no encontrado");
        }

        const portfolioUser = users[0];

        const projectsSql = `
            SELECT * FROM projects
            WHERE user_id = ?
        `;

        connection.query(projectsSql, [portfolioUser.id], (err, projects) => {

            if (err) {
                console.log(err);
                return res.send("Error");
            }

            const socialSql = `
                SELECT * FROM social_links
                WHERE user_id = ?
            `;

            connection.query(
                socialSql,
                [portfolioUser.id],
                (err, socialLinks) => {

                    if (err) {
                        console.log(err);
                        return res.send("Error");
                    }

                    let isOwner = false;

                    if (
                        req.session.user &&
                        req.session.user.id === portfolioUser.id
                    ) {
                        isOwner = true;
                    }

                    res.render("portfolio", {
                        portfolioUser,
                        projects,
                        socialLinks,
                        isOwner
                    });

                }
            );

        });

    });

});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Servidor funcionando");
});