export interface IPaginatorObject{
    current_page: number;
    items_per_page: number;
    total_pages: number;
    total_items: number;
}

export const getRangeForPagination = (paginator:IPaginatorObject) => {
    let _left_range = paginator.items_per_page * (paginator.current_page - 1);
    let _right_range = _left_range + paginator.items_per_page - 1;
    return { left: _left_range, right: _right_range };
};