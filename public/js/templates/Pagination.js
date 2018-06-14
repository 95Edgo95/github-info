(function (window) {
    window.PaginationTemplate = ({nextDisabled, prevDisabled}) => (
        `<div class="pagination">
            <span class="icon-container icon-left${prevDisabled ? " disabled" : ""}" onclick="window.paginateLeft()">
                <i class="arrow"></i>
                Prev
            </span>
            <span class="icon-container disabled icon-right${nextDisabled ? " disabled" : ""}" onclick="window.paginateRight()">
                Next
                <i class="arrow"></i>
            </span>
        </div>`
    );
}(window));