(function(window){

    const paginationSize = 20;

    function updatePaginationDisabled(paginationDetails) {
        const leftPaginations = document.getElementsByClassName("icon-left");
        const rightPaginations = document.getElementsByClassName("icon-right");

        for (let i = 0; i < leftPaginations.length; i++) {
            if (!paginationDetails.prevDisabled && leftPaginations[i].classList.contains("disabled")) {
                leftPaginations[i].classList.remove("disabled");
            } else if (paginationDetails.prevDisabled && !leftPaginations[i].classList.contains("disabled")) {
                leftPaginations[i].classList.add("disabled");
            }

            if (!paginationDetails.nextDisabled && rightPaginations[i].classList.contains("disabled")) {
                rightPaginations[i].classList.remove("disabled");
            } else if (paginationDetails.nextDisabled && !rightPaginations[i].classList.contains("disabled")) {
                rightPaginations[i].classList.add("disabled");
            }
        }
    }

    function getRepos(search, page, filter) {
        return request({url: "search/repositories", query: {q: `${search} in:${filter}`, per_page: paginationSize, page}});
    }

    function getUsers(search, page) {
        return request({url: "search/users", query: {q: `${search} in:login`, per_page: paginationSize, page}});
    }

    function checkIfEnter(key, cb) {
        if (key === "Enter") {
            cb();
        }
    }

    function request({url, query}) {
        const queryString = query ? urlEncode(query) : "";
        const link = `https://api.github.com/${url}${queryString ? `?${queryString}` : ""}`;

        return fetch(link)
            .then(res => res.json())
            .catch(err => console.dir(err));
    }

    function getUser(username) {
        return request({url: `users/${username}`});
    }

    function urlEncode(obj) {
        const queries = [];

        for (const prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                queries.push(`${encodeURIComponent(prop)}=${encodeURIComponent(obj[prop])}`);
            }
        }

        return queries.join("&")
    }

    window.helpers = {
        updatePaginationDisabled,
        checkIfEnter,
        getRepos,
        getUsers,
        getUser
    }

}(window));