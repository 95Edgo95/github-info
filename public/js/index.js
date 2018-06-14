(function (window, history) {
    const usersNav = document.getElementById("users-nav");
    const reposNav = document.getElementById("repos-nav");
    const pages = {
        userDetails: "user-details",
        users: "users",
        repos: "repos"
    };
    let selectedPage = "";

    document.addEventListener("NavigateToUserDetails", event => {
        initApp(event.detail);
    });

    function renderUserDetails(user) {
        if (!usersNav.classList.contains("active")) {
            usersNav.classList.add("active");
        }
        selectedPage = pages.users;
        window.userPage.reset();

        window.userPage.init(user || history.state && history.state.details && history.state.details.user);
    }

    window.onpopstate = function () {
        initApp();
    };

    function addListeners() {
        usersNav.addEventListener("click", () => {
            if (selectedPage !== pages.users) {
                history.pushState({page: pages.users}, "users", "users");
                selectedPage = pages.users;
                renderUsers();
            }
        });

        reposNav.addEventListener("click", () => {
            if (selectedPage !== pages.repos) {
                history.pushState({page: pages.repos}, "repos", "repos");
                selectedPage = pages.repos;
                renderRepos();
            }
        });
    }

    function renderUsers() {
        usersNav.classList.add("active");
        if (reposNav.classList.contains("active")) {
            reposNav.classList.remove("active");
        }
        window.paginateRight = window.usersPage.paginateRight;
        window.paginateLeft = window.usersPage.paginateLeft;

        window.usersPage.reset();
        window.usersPage.init();
    }

    function renderRepos() {
        reposNav.classList.add("active");
        if (usersNav.classList.contains("active")) {
            usersNav.classList.remove("active");
        }

        window.paginateRight = window.reposPage.paginateRight;
        window.paginateLeft = window.reposPage.paginateLeft;

        window.usersPage.reset();
        window.reposPage.init();
    }

    function initApp(user) {
        if (history.state && history.state.page) {
            if (history.state.page === pages.users) {
                renderUsers();
            } else if (history.state.page === pages.repos) {
                renderRepos();
            } else if (history.state.page === pages.userDetails) {
                renderUserDetails(user);
            }
        } else {
            if (usersNav.classList.contains("active")) {
                usersNav.classList.remove("active");
            }
            if (reposNav.classList.contains("active")) {
                reposNav.classList.remove("active");
            }
            const container = document.getElementById("content");
            container.innerHTML = "<div class='hint'>Select Page</div>";
        }

        addListeners();
    }

    window.initApp = initApp;

}(window, history));