(function (window, pagination) {
    window.ToolTipTemplate = ({placeholder, nextDisabled, prevDisabled, id}) => (
        `<div class="tooltip">
            <div class="input-wrapper">
                <input class="search-input" id="${id}-search" type="text" placeholder="${placeholder}">
            </div>
            ${pagination({nextDisabled, prevDisabled})}
        </div>`
    );
}(window, PaginationTemplate));