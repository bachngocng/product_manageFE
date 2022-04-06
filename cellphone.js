function getAllCellphones() {
    $.ajax({
        type: 'GET', url: 'http://localhost:8080/cellphones', success: function (cellphones) {
            let content = ``;
            cellphones = cellphones.content;
            for (let i = 0; i < cellphones.length; i++) {
                content += `<tr>
        <td>${i + 1}</td>
        <td>${cellphones[i].name}</td>
        <td>${cellphones[i].price}</td>
        <td>${cellphones[i].description}</td>
        <td><img src="http://localhost:8080/image/${cellphones[i].image}" width="150" height="100"></td>
        <td>${cellphones[i].category == null ? '' : cellphones[i].category.name}</td>
        <td><button class="btn btn-primary" data-target="#edit-cellphone" data-toggle="modal"
                                        type="button" onclick="showEditProduct(${cellphones[i].id})"><i class="fa fa-edit"></i></button></td>
        <td><button class="btn btn-danger" data-target="#delete-cellphone" data-toggle="modal"
                                        type="button" onclick="showDeleteProduct(${cellphones[i].id})"><i class="fa fa-trash"></i></button></td>
    </tr>`

            }
            $('#cellphone-list-content').html(content);
        }
    })
}

function findProduct() {
    let q = $('#search').val();
    $.ajax({
        type: 'GET', url: `http://localhost:8080/cellphones?q=${q}`, success: function (cellphones) {
            let content = '';
            cellphones = cellphones.content;
            for (let i = 0; i < cellphones.length; i++) {
                content += `<tr>
        <td>${i + 1}</td>
        <td>${cellphones[i].name}</td>
        <td>${cellphones[i].price}</td>
        <td>${cellphones[i].description}</td>
        <td><img src="http://localhost:8080/image/${cellphones[i].image}" height="100px" width="150px"></td>
        <td>${cellphones[i].category == null ? '' : cellphones[i].category.name}</td>
        <td><button class="btn btn-primary" data-target="#edit-cellphone" data-toggle="modal"
                                        type="button" onclick="showEditProduct(${cellphones[i].id})"><i class="fa fa-edit"></i></button></td>
        <td><button class="btn btn-danger" data-target="#delete-cellphone" data-toggle="modal"
                                        type="button" onclick="showDeleteProduct(${cellphones[i].id})"><i class="fa fa-trash"></i></button></td>
    </tr>`
            }
            $('#cellphone-list-content').html(content);
        }
    })
}

function createNewProduct() {
    let name = $('#name').val();
    let price = $("#price").val();
    let description = $('#description').val();
    let image = $('#image');
    let category = $('#category').val();
    let cellphone = new FormData();
    cellphone.append('name', name);
    cellphone.append('price', price);
    cellphone.append('description', description);
    cellphone.append('category', category);
    cellphone.append('image', image.prop('files')[0]);
    $.ajax({
        type: 'POST',
        url: 'http://localhost:8080/cellphones',
        data: cellphone,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function () {
            getAllCellphones();
            showSuccessMessage('Tạo thành công!');
        },
        error: function () {
            showErrorMessage('Tạo lỗi!')
        }
    })
}

function showSuccessMessage(message) {
    $(function () {
        var Toast = Swal.mixin({
            toast: true, position: 'top-end', showConfirmButton: false, timer: 3000
        });
        Toast.fire({
            icon: 'success', title: message
        })
    });
}

function showErrorMessage(message) {
    $(function () {
        var Toast = Swal.mixin({
            toast: true, position: 'top-end', showConfirmButton: false, timer: 3000
        });
        Toast.fire({
            icon: 'error', title: message
        })
    });
}

function showDeleteProduct(id) {
    let content = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${id})" data-dismiss="modal" type="button">Xóa</button>`;
    $('#footer-delete').html(content);
}

function deleteProduct(id) {
    $.ajax({
        type: 'DELETE', url: `http://localhost:8080/cellphones/${id}`, success: function () {
            getAllCellphones();
            showSuccessMessage('Xóa thành công!');
        }, error: function () {
            showErrorMessage('Xóa lỗi');
        }
    })
}


function showEditProduct(id) {
    $.ajax({
        type: "GET", url: `http://localhost:8080/cellphones/${id}`, success: function (cellphone) {
            $('#editName').val(cellphone.name);
            $('#editPrice').val(cellphone.price);
            $('#editDescription').val(cellphone.description);
            $.ajax({
                type: 'GET', url: 'http://localhost:8080/categories', success: function (categories) {
                    let content = ``;
                    if (cellphone.category != null) {
                        content = `<option value="${cellphone.category.id}">${cellphone.category.name}</option>`;
                    } else {
                        content = `<option>Chọn danh mục sản phẩm</option>`;
                    }
                    for (let category of categories) {
                        content += `<option value="${category.id}">${category.name}</option>`
                    }
                    $('#editCategory').html(content);
                }
            })

            let content = `<button class="btn btn-secondary" data-dismiss="modal" type="button">Đóng</button>
                    <button class="btn btn-primary" onclick="editProduct(${id})" type="button" aria-label="Close" class="close" data-dismiss="modal">Chỉnh sửa</button>`;
            $('#edit-cellphone-footer').html(content);
        }
    })
}

function drawCategory() {
    $.ajax({
        type: 'GET', url: 'http://localhost:8080/categories', success: function (categories) {
            let content = `<option>Chọn danh mục sản phẩm</option>`;
            for (let category of categories) {
                content += `<option value=${category.id}>${category.name}</option>`;
            }
            $('#category').html(content);
        }
    })
}

function editProduct(id) {
    let name = $('#editName').val();
    let price = $("#editPrice").val();
    let description = $('#editDescription').val();
    let image = $('#editImage');
    let category = $('#editCategory').val();
    let cellphone = new FormData();
    cellphone.append('name', name);
    cellphone.append('price', price);
    cellphone.append('description', description);
    cellphone.append('category', category);
    cellphone.append('image', image.prop('files')[0]);
    $.ajax({
        type: 'POST',
        url: `http://localhost:8080/cellphones/${id}`,
        data: cellphone,
        enctype: 'multipart/form-data',
        processData: false,
        contentType: false,
        success: function () {
            getAllCellphones();
            showSuccessMessage('Sửa thành công!');
        },
        error: function () {
            showErrorMessage('Sửa lỗi');
        }
    })
}

function getProductsByPage(page) {
    $.ajax({
        type: 'GET', url: `http://localhost:8080/cellphones?page=${page}`, success: function (data) {
            let array = data.content;
            let content = "";
            for (let i = 0; i < array.length; i++) {
                content += `<tr>
            <td>${i + 1}</td>
            <td>${array[i].name}</td>
            <td>${array[i].price}</td>
            <td>${array[i].description}</td>
            <td><img src="http://localhost:8080/image/${array[i].image}" alt="Ảnh sản phẩm" width="100" height="100"></td>  
            <td>${array[i].category?.name}</td>
            <td><button type="button" id="editProduct" class="btn btn-primary" data-target="#create-product" data-toggle="modal" onclick="showEditProduct(${array[i].id})"><i class="fa fa-edit"></i></button></td>
            <td><button class="btn btn-danger" data-target="#delete-product" data-toggle="modal"
                                        type="button" onclick="showDeleteProduct(${array[i].id})"><i class="fa fa-trash"></i></button></td>
        </tr>`
            }
            document.getElementById("cellphone-list-content").innerHTML = content;
            $('#displayPage').html(`<button class="btn btn-primary" id="first" onclick="getProductsByPage(0)" style="margin-right: 10px">1</i></button><button class="btn btn-primary" id="backup" onclick="getProductsByPage(${data.pageable.pageNumber}-1)">«</i></button>
    <span>Trang </span><span>${data.pageable.pageNumber + 1} / ${data.totalPages}</span>
<button class="btn btn-primary" id="next" onclick="getProductsByPage(${data.pageable.pageNumber}+1)">»</button>
<button class="btn btn-primary" id="last" onclick="getProductsByPage(${data.totalPages}-1)">${data.totalPages}</button>`);
            //điều kiện bỏ nút previous
            if (data.pageable.pageNumber === 0) {
                $("#backup").hide();
                $("#first").hide();
            }
            //điều kiện bỏ nút next
            if (data.pageable.pageNumber + 1 === data.totalPages) {
                $("#next").hide();
                $("#last").hide();
            }
        }
    });

}

$(document).ready(function () {
    getAllCellphones();
    getProductsByPage(0);
})