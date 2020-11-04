const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = {
    async store(req, res) {
        const { userName, email, password, userType } = req.body;

        if (!userName || !email || !password) {
            res.status(400).json({ error: "Preencha todos os campos" });
        }

        const users = await User.find({}).exec();

        if (users.filter((user) => user.userName === userName).length) {
            res.status(400).json({
                error: "Foi encontrado um user com mesmo login",
            });
        }
        if (users.filter((user) => user.email === email).length) {
            res.status(400).json({
                error: "Foi encontrado um user com mesmo email",
            });
        }

        const user = await User.create({
            userName,
            email,
            password,
            userType,
        });
        const token = jwt.sign(
            {
                userName,
                userType: user.userType,
            },
            "secret"
        );
        res.cookie("token", token);
        res.status(200).json({ token: token });
    },
    async login(req, res) {
        const { userName, password } = req.body;
        if (!userName || !password) {
            res.status(400).json({ error: "Preencha todos os campos" });
        }

        const user = await User.findOne({ userName });

        if (!user) {
            res.status(400).json({ error: "Usuário nao encontrado" });
        }

        if (user.password !== password) {
            res.status(400).json({ error: "Senha nao bate" });
        } else {
            const token = jwt.sign(
                {
                    userName,
                    userType: user.userType,
                },
                "secret"
            );
            res.cookie("token", token);
            res.status(200).json({ token: token });
        }
    },

    async verify(req, res) {
        const token = req.cookies.token;
        console.log("req: ", req.headers["x-xsrf-token"]);
        console.log("cookies: ", req.signedCookies);

        if (!token) return res.status(401).json({ error: "Access Denied" });

        try {
            const verified = jwt.verify(token, "secret");
            res.status(200).json({ success: true });
        } catch (err) {
            res.status(400).json({ error: "invalid token" });
        }
    },
};
