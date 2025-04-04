const express = require("express");
const router = express.Router();
const notices = require("../models/notices");
const User = require("../models/user");
const { Query } = require("../models/query");
const { Reply } = require("../models/query");
let app = express();
const routes = [
	{ path: "/", view: "department", title: "Home" },
	{ path: "/notice", view: "notice", title: "Notice" },
	{ path: "/queries", view: "queries", title: "Queries" },
	{ path: "/about", view: "about", title: "About" },
	{ path: "/admin", view: "admin", title: "Admin" },
	{ path: "/login", view: "login", title: "Login" },
	{ path: "/signup", view: "signup", title: "Signup" },
	{ path: "/dashboard", view: "dashboard", title: "Dashboard" },
	{ path: "/cs", view: "departments/cs", title: "Computer Engineering" },
	{ path: "/aids", view: "departments/aids", title: "AI & DS" },
	{ path: "/extc", view: "departments/extc", title: "Electronics" },
	{ path: "/fe", view: "departments/fe", title: "First Year" },
	{ path: "/it", view: "departments/it", title: "Information Technology" },
	{ path: "/mech", view: "departments/mech", title: "Mechanical" },
	{ path: "/acc", view: "departments/acc", title: "Accounts" },
	{ path: "/lib", view: "departments/lib", title: "Library" },
	{ path: "/upload_notice", view: "upload_notice", title: "Upload Notice" },
	{
		path: "/upload_query/:noticeId/:noticeTitle/:noticeDep",
		view: "upload_query",
		title: "Upload Query",
	},
	{
		path: "/upload_reply/:queryId",
		view: "upload_reply",
		title: "Upload Reply",
	},
];

const redirectLogin = (req, res, next) => {
	if (!req.session.userId && req.url !== "/login" && req.url !== "/signup") {
		res.render("login", { title: "Login", isAdmin: req.session.isAdmin });
	} else {
		next();
	}
};

routes.forEach((route) => {
	router.get(route.path, redirectLogin, async (req, res) => {
		if (
			route.path === "/notice" ||
			route.path === "/cs" ||
			route.path === "/aids" ||
			route.path === "/extc" ||
			route.path === "/fe" ||
			route.path === "/it" ||
			route.path === "/mech" ||
			route.path === "/acc" ||
			route.path === "/lib"
		) {
			const allNotices = await notices.find({});
			res.render(route.view, {
				title: route.title,
				notices: allNotices,
				isAdmin: req.session.isAdmin,
			});
		} else if (route.path === "/") {
			const sorted_notices = await notices
				.find()
				.sort({ creation_date: "desc" })
				.limit(10);
			res.render(route.view, {
				title: route.title,
				notices: sorted_notices,
				isAdmin: req.session.isAdmin,
			});
		} else if (route.path === "/admin") {
			const no_notices = await notices.countDocuments();
			const all_users = await User.find({});
			res.render(route.view, {
				title: route.title,
				notices: no_notices,
				users: all_users,
				isAdmin: req.session.isAdmin,
			});
		} else if (
			route.path === "/queries" ||
			route.path === "/dashboard" ||
			route.path === "/upload_query/:noticeId/:noticeTitle/:noticeDep" ||
			route.path === "/upload_reply/:queryId"
		) {
			const allQueries = await Query.find({});
			const allReplies = await Reply.find({});
			const currentuser = await User.findOne(req.session.userId);
			res.render(route.view, {
				title: route.title,
				isAdmin: req.session.isAdmin,
				queries: allQueries,
				replies: allReplies,
				queryId: req.params.queryId,
				noticeId: req.params.noticeId,
				noticeName: req.params.noticeTitle,
				noticeDep: req.params.noticeDep,
				userId: req.session.userId,
				currentuser:currentuser,
			});
		} else {
			res.render(route.view, {
				title: route.title,
				isAdmin: req.session.isAdmin,
			});
		}
	});
});
// const ensureAuthenticated = (req, res, next) => {
//     if (req.session.userId) {
//         return next();
//     }
//     res.redirect('/login');
// };
// // app.get('/dashboard', function(req, res) {
// //     // Fetch user from database
// //     var user = getUserFromDatabase();

// //     // Render dashboard view with user data
// //     res.render('dashboard', { user: user });
// // });
// app.get('/dashboard', ensureAuthenticated, async (req, res) => {
//     const user = await User.findById(req.session.userId);
//     console.log(user);
//     res.render('dashboard', { user: user });
// });
module.exports = router;
