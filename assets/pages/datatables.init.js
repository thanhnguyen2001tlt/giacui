/*
 Template Name: Zegva - Responsive Bootstrap 4 Admin Dashboard
 Author: Themesdesign
 Website: www.themesdesign.in
 File: Datatable js
 */

 $(document).ready(function() {
  

    //Buttons examples
    var table = $('#datatable').DataTable({
        lengthChange: false,
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
        "language": {
            "paginate": {
              "first": "Trang Đầu",
              "previous": "Trang Trước",
              "next": "Trang Sau ",
              "last": "Trang Cuối",
            },
             "info": "Hiển thị _START_ tới _END_ của _TOTAL_ mục",
             "search":"Tìm Kiếm",
             "emptyTable": "Chưa có dữ liệu!"
          }
    });
    var table = $('#datadataorderDetails').DataTable({
      lengthChange: false,
      searching: false, 
      "language": {
          "paginate": {
            "first": "Trang Đầu",
            "previous": "Trang Trước",
            "next": "Trang Sau ",
            "last": "Trang Cuối",
          },
           "info": "Hiển thị _START_ tới _END_ của _TOTAL_ mục",
           "search":"Tìm Kiếm",
           "emptyTable": "Chưa có dữ liệu!"
        }
  });
    

    table.buttons().container()
        .appendTo('#datatable_wrapper .col-md-6:eq(0)');

        $('#cart').DataTable({
            searching: false, // Vô hiệu hóa chức năng tìm kiếm
            paging: false, // Bật chức năng phân trang
            info: false, // Hiển thị thông tin số trang, số bản ghi, ...
            "language": {
                "emptyTable": "Chưa có sản phẩm !"
              }
          });
          $('#prints').DataTable({
            searching: false, // Vô hiệu hóa chức năng tìm kiếm
            paging: false, // Bật chức năng phân trang
            info: false, // Hiển thị thông tin số trang, số bản ghi, ...
            ordering: false,
            "language": {
                "emptyTable": "Chưa có sản phẩm !"
              }
          });
          
        
} );