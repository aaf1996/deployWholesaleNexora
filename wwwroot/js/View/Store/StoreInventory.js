ns('Mitosiz.Site.StoreInventory.Index')
Mitosiz.Site.StoreInventory.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Function.GetStoreInventoryAdmin();
        base.Function.clsNumberPagination();
        base.Function.clsNumberPaginationModal();
        base.Function.clsUpdateDataClick();
        base.Function.clsUpdtStock();
        base.Control.btnSearch().click(base.Event.btnSearchClick);
        base.Control.btnSearchModal().click(base.Event.btnSearchModalClick);
        base.Control.btnClear().click(base.Event.btnClearClick);
        base.Control.btnClearModal().click(base.Event.btnClearModalClick);
        base.Control.btnReportModal().click(base.Event.btnReportModalClick);
    };
    base.Parameters = {
        currentPage: 1,
        currentPageModal: 1,
        totalPages: 1,
        totalPagesModal: 1,
        sizePagination: 10,
        sizePaginationModal: 10,
        storeNameForModal: "",
        storeIdModal: 0,
        storeInventoryIdModal: 0
    };
    base.Control = {
        divPagination: function () { return $('#pagination'); },
        divPaginationModal: function () { return $('#paginationModal'); },
        tbodyTable: function () { return $('#tbodyStock'); },
        tbodyStockModal: function () { return $('#tbodyStockModal'); },
        txtStoreNameFilter: function () { return $('#txtStoreNameFilter'); },
        btnSearch: function () { return $('#btnSearch'); },
        btnSearchModal: function () { return $('#btnSearchModal'); },
        btnReportModal: function () { return $('#btnReportModal'); },
        btnClear: function () { return $('#btnClear'); },
        btnClearModal: function () { return $('#btnClearModal'); },
        modalUpdate: function () { return $('#modalUpdate'); },
        txtStoreNameModal: function () { return $('#txtStoreNameModal'); },
        txtProductFilterModal: function () { return $('#txtProductFilterModal'); },
    };
    base.Event = {
        AjaxGetStoreInventoryForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPages = data.data.totalPages;
                    base.Function.FillData(data.data.storeInventoryForAdmin);
                }
            }
        },
        AjaxGetDetailStoreInventoryForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPagesModal = data.data.totalPages;
                    base.Control.txtStoreNameModal().val(base.Parameters.storeNameForModal);
                    base.Function.FillDataIntoModal(data.data.detailStoreInventoryForAdmin);
                    base.Control.modalUpdate().modal('show');
                }
            }
        },
        AjaxUpdateStockForAdminSuccess: function (data) {
            if (data) {
                $('#tdQuantity' + base.Parameters.storeInventoryIdModal + '').text(data.data);
                $('#txtInc' + base.Parameters.storeInventoryIdModal + '').val("0");
                $('#txtDec' + base.Parameters.storeInventoryIdModal + '').val("0");
                base.Function.ShowToastr("El Stock fue actualizado");
            }
        },
        AjaxGenerateStoreInventoryReportSuccess: function (data) {
            if (data) {
                window.open('https://api.soynexora.com/StaticFiles/ReportStoreInventory/'+data.data);
            }
        },
        btnSearchClick: function () {
            base.Parameters.currentPage = 1;
            base.Ajax.AjaxGetStoreInventoryForAdmin.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                storeName: base.Control.txtStoreNameFilter().val()
            };
            base.Ajax.AjaxGetStoreInventoryForAdmin.submit();
        },
        btnSearchModalClick: function () {
            base.Parameters.currentPageModal = 1;
            base.Ajax.AjaxGetDetailStoreInventoryForAdmin.data = {
                number: base.Parameters.currentPageModal,
                size: base.Parameters.sizePaginationModal,
                storeId: base.Parameters.storeIdModal,
                productName: base.Control.txtProductFilterModal().val()
            };
            base.Ajax.AjaxGetDetailStoreInventoryForAdmin.submit();
        },
        btnClearClick: function () {
            base.Function.ClearFilters();
            base.Parameters.currentPage = 1;
            base.Ajax.AjaxGetStoreInventoryForAdmin.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                storeName: base.Control.txtStoreNameFilter().val()
            };
            base.Ajax.AjaxGetStoreInventoryForAdmin.submit();
        },
        btnClearModalClick: function () {
            base.Function.ClearFiltersModal();
            base.Parameters.currentPage = 1;
            base.Ajax.AjaxGetDetailStoreInventoryForAdmin.data = {
                number: base.Parameters.currentPageModal,
                size: base.Parameters.sizePaginationModal,
                storeId: base.Parameters.storeIdModal,
                productName: base.Control.txtProductFilterModal().val()
            };
            base.Ajax.AjaxGetDetailStoreInventoryForAdmin.submit();
        },
        btnReportModalClick: function () {
            base.Ajax.AjaxGenerateStoreInventoryReport.data = {
                storeId: base.Parameters.storeIdModal
            };
            base.Ajax.AjaxGenerateStoreInventoryReport.submit();
        },
    };
    base.Ajax = {
        AjaxGetStoreInventoryForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.StoreInventory.Actions.GetStoreInventoryForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetStoreInventoryForAdminSuccess
        }),
        AjaxGetDetailStoreInventoryForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.StoreInventory.Actions.GetDetailStoreInventoryForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetDetailStoreInventoryForAdminSuccess
        }),
        AjaxUpdateStockForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.StoreInventory.Actions.UpdateStockForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxUpdateStockForAdminSuccess
        }),
        AjaxGenerateStoreInventoryReport: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.StoreInventory.Actions.GenerateStoreInventoryReport,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGenerateStoreInventoryReportSuccess
        }),
    };
    base.Function = {
        UpdatePagination: function () {
            base.Control.divPagination().empty();
            base.Control.divPagination().append('<li class="page-item page-indicator"><a class="page-link number-page" href="#" id="prev">«</a></li>');

            if (base.Parameters.totalPages <= 5) {
                for (var i = 1; i <= base.Parameters.totalPages; i++) {
                    base.Control.divPagination().append('<li class="page-item ' + (i === base.Parameters.currentPage ? 'active' : '') + '"><a class="page-link number-page" href="#">' + i + '</a></li>');
                }
            } else {
                var startPage = Math.max(1, base.Parameters.currentPage - 2);
                var endPage = Math.min(base.Parameters.totalPages, base.Parameters.currentPage + 2);

                if (base.Parameters.currentPage >= base.Parameters.totalPages - 2) {
                    startPage = base.Parameters.totalPages - 4;
                }

                if (startPage > 1) {
                    base.Control.divPagination().append('<li class="page-item"><a class="page-link number-page" href="#">1</a></li>');
                    if (startPage > 2) {
                        if (base.Parameters.currentPage != base.Parameters.totalPages) {
                            endPage--;
                        }
                        startPage++;
                        var valueHidden = startPage - 1;
                        base.Control.divPagination().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden + '" class="page-link number-page" href="#">..</a></li>');
                    }
                }

                for (var i = startPage; i <= endPage; i++) {
                    base.Control.divPagination().append('<li class="page-item ' + (i === base.Parameters.currentPage ? 'active' : '') + '"><a class="page-link number-page" href="#">' + i + '</a></li>');
                }

                if (endPage < base.Parameters.totalPages) {
                    if (endPage < base.Parameters.totalPages - 1) {
                        var valueHidden = endPage + 1;
                        base.Control.divPagination().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden + '" class="page-link number-page" href="#">..</a></li>');
                    }
                    base.Control.divPagination().append('<li class="page-item"><a class="page-link number-page" href="#">' + base.Parameters.totalPages + '</a></li>');
                }
            }

            base.Control.divPagination().append('<li class="page-item page-indicator"><a class="page-link number-page" href="#" id="next">»</a></li>');
        },
        UpdatePaginationModal: function () {
            base.Control.divPaginationModal().empty();
            base.Control.divPaginationModal().append('<li class="page-item page-indicator"><a class="page-link number-page-modal" href="#" id="prev">«</a></li>');

            if (base.Parameters.totalPagesModal <= 5) {
                for (var i = 1; i <= base.Parameters.totalPagesModal; i++) {
                    base.Control.divPaginationModal().append('<li class="page-item ' + (i === base.Parameters.currentPageModal ? 'active' : '') + '"><a class="page-link number-page-modal" href="#">' + i + '</a></li>');
                }
            } else {
                var startPage = Math.max(1, base.Parameters.currentPageModal - 2);
                var endPage = Math.min(base.Parameters.totalPagesModal, base.Parameters.currentPageModal + 2);

                if (base.Parameters.currentPageModal >= base.Parameters.totalPagesModal - 2) {
                    startPage = base.Parameters.totalPagesModal - 4;
                }

                if (startPage > 1) {
                    base.Control.divPaginationModal().append('<li class="page-item"><a class="page-link number-page-modal" href="#">1</a></li>');
                    if (startPage > 2) {
                        if (base.Parameters.currentPageModal != base.Parameters.totalPagesModal) {
                            endPage--;
                        }
                        startPage++;
                        var valueHidden = startPage - 1;
                        base.Control.divPaginationModal().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden + '" class="page-link number-page-modal" href="#">..</a></li>');
                    }
                }

                for (var i = startPage; i <= endPage; i++) {
                    base.Control.divPaginationModal().append('<li class="page-item ' + (i === base.Parameters.currentPageModal ? 'active' : '') + '"><a class="page-link number-page-modal" href="#">' + i + '</a></li>');
                }

                if (endPage < base.Parameters.totalPagesModal) {
                    if (endPage < base.Parameters.totalPagesModal - 1) {
                        var valueHidden = endPage + 1;
                        base.Control.divPaginationModal().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden + '" class="page-link number-page-modal" href="#">..</a></li>');
                    }
                    base.Control.divPaginationModal().append('<li class="page-item"><a class="page-link number-page-modal" href="#">' + base.Parameters.totalPagesModal + '</a></li>');
                }
            }

            base.Control.divPaginationModal().append('<li class="page-item page-indicator"><a class="page-link number-page-modal" href="#" id="next">»</a></li>');
        },
        clsNumberPagination: function () {
            var parentElement = $(document);
            parentElement.on('click', '.number-page', function () {
                var page = $(this).text();
                if (page === '«') {
                    if (base.Parameters.currentPage > 1) {
                        base.Parameters.currentPage--;
                    }
                } else if (page === '»') {
                    if (base.Parameters.currentPage < base.Parameters.totalPages) {
                        base.Parameters.currentPage++;
                    }
                } else if (page === '..') {
                    base.Parameters.currentPage = parseInt($(this).attr('value-hidden'));
                } else {
                    base.Parameters.currentPage = parseInt(page);
                }
                base.Function.GetStoreInventoryAdmin();
            });
        },
        clsNumberPaginationModal: function () {
            var parentElement = $(document);
            parentElement.on('click', '.number-page-modal', function () {
                var page = $(this).text();
                if (page === '«') {
                    if (base.Parameters.currentPageModal > 1) {
                        base.Parameters.currentPageModal--;
                    }
                } else if (page === '»') {
                    if (base.Parameters.currentPageModal < base.Parameters.totalPagesModal) {
                        base.Parameters.currentPageModal++;
                    }
                } else if (page === '..') {
                    base.Parameters.currentPageModal = parseInt($(this).attr('value-hidden'));
                } else {
                    base.Parameters.currentPageModal = parseInt(page);
                }
                base.Function.GetDetailStoreInventoryAdmin();
            });
        },
        GetStoreInventoryAdmin: function () {
            base.Ajax.AjaxGetStoreInventoryForAdmin.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                storeName: base.Control.txtStoreNameFilter().val()
            };
            base.Ajax.AjaxGetStoreInventoryForAdmin.submit();
        },
        GetDetailStoreInventoryAdmin: function () {
            base.Ajax.AjaxGetDetailStoreInventoryForAdmin.data = {
                number: base.Parameters.currentPageModal,
                size: base.Parameters.sizePaginationModal,
                storeId: base.Parameters.storeIdModal,
                productName: base.Control.txtProductFilterModal().val()
            };
            base.Ajax.AjaxGetDetailStoreInventoryForAdmin.submit();
        },
        FillData: function (listData) {
            base.Control.tbodyTable().empty();
            listData.forEach(function (data) {
                var status = data.active == true ? "Activo" : "Desactivo";
                base.Control.tbodyTable().append('<tr style="text-align: center;">' +
                    '<td id="td' + data.storeId + '"><strong>' + data.storeName + '</strong></td>' +
                    '<td>' + status + '</td>' +
                    '<td>'+
                    '<div class="dropdown">' +
                    '<button type="button" class="btn btn-success light sharp" data-bs-toggle="dropdown">' +
                    '<svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1">' +
                    '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
                    '<rect x="0" y="0" width="24" height="24" /><circle fill="#000000" cx="5" cy="12" r="2" /><circle fill="#000000" cx="12" cy="12" r="2" /><circle fill="#000000" cx="19" cy="12" r="2" />' +
                    '</g>' +
                    '</svg>' +
                    '</button>' +
                    '<div class="dropdown-menu">' +
                    '<a class="dropdown-item updateData" value="' + data.storeId + '" href="#">Actualizar</a>' +
                    '</div>' +
                    '</div></td>' +
                    '</tr>');
            });
            base.Function.UpdatePagination();
        },
        clsUpdateDataClick: function () {
            var parentElement = $(document);
            parentElement.on('click', '.updateData', function () {
                var storeId = $(this).attr('value');
                base.Parameters.storeIdModal = storeId;
                base.Parameters.storeNameForModal = $("#td" + storeId + " strong").text();
                base.Control.txtProductFilterModal().val("");
                base.Ajax.AjaxGetDetailStoreInventoryForAdmin.data = {
                    number: base.Parameters.currentPageModal,
                    size: base.Parameters.sizePaginationModal,
                    storeId: storeId,
                    productName: base.Control.txtProductFilterModal().val()
                };
                base.Ajax.AjaxGetDetailStoreInventoryForAdmin.submit();
            });
        },
        FillDataIntoModal: function (lisDataDetail) {
            base.Control.tbodyStockModal().empty();
            lisDataDetail.forEach(function (data) {
                var checked = data.freeStock == true ? "checked" : "";
                base.Control.tbodyStockModal().append('<tr style="text-align: center;">' +
                    '<td class="column-modal"><strong>' + data.storeInventoryId + '</strong></td>' +
                    '<td class="column-modal">' + data.productName + '</td>' +
                    '<td class="column-modal"><div class="col-xl-4 col-xxl-6 col-6" style="padding-left: 40%;">' +
                    '<div class= "form-check custom-checkbox mb-3" >' +
                    '<input type="checkbox" '+checked+' class="form-check-input" id="chk' + data.storeInventoryId+'">' +
                    '</div>' +
                    '</div ></td>' +
                    '<td class="column-modal" id="tdQuantity' + data.storeInventoryId +'">' + data.quantity + '</td>' +
                    '<td class="column-modal"><input type="text" value="0" style="text-align: center;" class="form-control mb-xl-0 mb-1" id="txtInc' + data.storeInventoryId+'"></td>' +
                    '<td class="column-modal"><input type="text" value="0" style="text-align: center;" class="form-control mb-xl-0 mb-1" id="txtDec' + data.storeInventoryId +'"></td>' +
                    '<td class="column-modal">' +
                    '<div class="btnUptStock" value="' + data.storeInventoryId +'">' +
                    '<a class= "btn btn-primary shadow btn-s sharp me-1">' +
                    '<i class="fa-solid fa-pen-to-square"></i>' +
                    '</a>' +
                    '</div></td>' +
                    '</tr>');
            });
            base.Function.UpdatePaginationModal();
        },
        ClearFilters: function () {
            base.Control.txtStoreNameFilter().val("");
        },
        ClearFiltersModal: function () {
            base.Control.txtProductFilterModal().val("");
        },
        clsUpdtStock: function () {
            var parentElement = $(document);
            parentElement.on('click', '.btnUptStock', function () {
                var storeInventoryId = $(this).attr('value');
                base.Parameters.storeInventoryIdModal = storeInventoryId;
                base.Ajax.AjaxUpdateStockForAdmin.data = {
                    freeStock: $("#chk" + storeInventoryId +"").prop("checked"),
                    increase: $('#txtInc' + storeInventoryId +'').val(),
                    decrease: $('#txtDec' + storeInventoryId +'').val(),
                    storeInventoryId: storeInventoryId
                };
                base.Ajax.AjaxUpdateStockForAdmin.submit();
            });
        },
        ShowToastr: function (message) {
            toastr.success(""+message+"", "Excelente", {
                timeOut: 5e3,
                closeButton: !0,
                debug: !1,
                newestOnTop: !0,
                progressBar: !0,
                positionClass: "toast-top-right",
                preventDuplicates: !0,
                onclick: null,
                showDuration: "300",
                hideDuration: "1000",
                extendedTimeOut: "1000",
                showEasing: "swing",
                hideEasing: "linear",
                showMethod: "fadeIn",
                hideMethod: "fadeOut",
                tapToDismiss: !1
            })
        },
    };
}