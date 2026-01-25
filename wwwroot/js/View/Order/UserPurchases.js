ns('Mitosiz.Site.UserPurchases.Index')
Mitosiz.Site.UserPurchases.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Function.GetLogin();
        base.Function.clsNumberPagination();
        base.Control.btnClear().click(base.Event.btnClearClick);
        base.Control.btnSearch().click(base.Event.btnSearchClick);
        base.Function.clsDetailPurchaseClick();
        base.Function.clsApprobeShippingClick();
        base.Function.clsNumberPaginationModal();
    };
    base.Parameters = {
        storeId: 0,
        purchaseId: 0,
        currentPage: 1,
        currentPageModal: 1,
        totalPages: 1,
        totalPagesModal: 1,
        sizePagination: 10,
        sizePaginationModal: 5
    };
    base.Control = {
        btnClear: function () { return $('#btnClear'); },
        btnSearch: function () { return $('#btnSearch'); },
        tbodyTable: function () { return $('#tbodyPurchase'); },
        divPagination: function () { return $('#pagination'); },
        divPaginationModal: function () { return $('#paginationModal'); },
        tbodyDetailPurchase: function () { return $('#tbodyDetailPurchase'); },
        txtStartDate: function () { return $('#txtStartDate'); },
        txtEndDate: function () { return $('#txtEndDate'); },
        txtUserName: function () { return $('#txtUserName'); },
        txtUserId: function () { return $('#txtUserId'); },
        txtPurchaseId: function () { return $('#txtPurchaseId'); },
        modalDetail: function () { return $('#modalDetail'); },
    };
    base.Event = {
        AjaxGetLoginSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.storeId = data.data.storeId;
                    base.Function.GetUserPurchases();
                }
            }
        },
        AjaxGetPurchasesByWholesaleSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPages = data.data.totalPages;
                    base.Function.FillData(data.data.purchasesByWholesale);
                }
            }
        },
        btnClearClick: function () {
            base.Function.ClearFilters();
            base.Parameters.currentPage = 1;
            var purchaseId = base.Control.txtPurchaseId().val() != "" ? base.Control.txtPurchaseId().val() : 0;
            var userId = base.Control.txtUserId().val() != "" ? base.Control.txtUserId().val() : 0;
            base.Ajax.AjaxGetPurchasesByWholesale.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                storeId: base.Parameters.storeId,
                names: base.Control.txtUserName().val(),
                purchaseId: purchaseId,
                userId: userId,
                startDateString: base.Control.txtStartDate().val(),
                endDateString: base.Control.txtEndDate().val()
            };
            base.Ajax.AjaxGetPurchasesByWholesale.submit();
        },
        btnSearchClick: function () {
            base.Parameters.currentPage = 1;
            var purchaseId = base.Control.txtPurchaseId().val() != "" ? base.Control.txtPurchaseId().val() : 0;
            var userId = base.Control.txtUserId().val() != "" ? base.Control.txtUserId().val() : 0;
            base.Ajax.AjaxGetPurchasesByWholesale.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                storeId: base.Parameters.storeId,
                names: base.Control.txtUserName().val(),
                purchaseId: purchaseId,
                userId: userId,
                startDateString: base.Control.txtStartDate().val(),
                endDateString: base.Control.txtEndDate().val()
            };
            base.Ajax.AjaxGetPurchasesByWholesale.submit();
        },
        AjaxGetPurchaseDetailForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPagesModal = data.data.totalPages;
                    base.Function.FillDataDetailOrderIntoModal(data.data.purchaseDetailForAdmin);
                    base.Control.modalDetail().modal('show');
                }
            }
        },
        AjaxApprobeShippingStatusPurchaseSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    Swal.fire("Excelente !!", "La compra fue entregada !!", "success")
                    base.Function.GetUserPurchases();
                }
                else {
                    Swal.fire("Oops...", "Ocurrió un error, Por favor intententelo nuevamente", "error")
                }
            }
        },
    };
    base.Ajax = {
        AjaxGetLogin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.UserPurchases.Actions.GetLogin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetLoginSuccess
        }),
        AjaxGetPurchasesByWholesale: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.UserPurchases.Actions.GetPurchasesByWholesale,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetPurchasesByWholesaleSuccess
        }),
        AjaxGetPurchaseDetailForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.UserPurchases.Actions.GetPurchaseDetailForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetPurchaseDetailForAdminSuccess
        }),
        AjaxApprobeShippingStatusPurchase: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.UserPurchases.Actions.ApprobeShippingStatusPurchase,
            autoSubmit: false,
            onSuccess: base.Event.AjaxApprobeShippingStatusPurchaseSuccess
        }),
    };
    base.Function = {
        GetLogin: function () {
            base.Ajax.AjaxGetLogin.submit();
        },
        GetUserPurchases: function () {
            var purchaseId = base.Control.txtPurchaseId().val() != "" ? base.Control.txtPurchaseId().val() : 0;
            var userId = base.Control.txtUserId().val() != "" ? base.Control.txtUserId().val() : 0;
            base.Ajax.AjaxGetPurchasesByWholesale.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                storeId: base.Parameters.storeId,
                purchaseId: purchaseId,
                userId: userId,
                names: base.Control.txtUserName().val(),
                startDateString: base.Control.txtStartDate().val(),
                endDateString: base.Control.txtEndDate().val()
            };
            base.Ajax.AjaxGetPurchasesByWholesale.submit();
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
                base.Function.GetUserPurchases();
            });
        },
        FillData: function (listData) {
            base.Control.tbodyTable().empty();
            listData.forEach(function (data) {
                var styleApprobeShipping = data.statusPurchase != 'Validada' ? "display:none;" : "";
                base.Control.tbodyTable().append('<tr style="text-align: center;">' +
                    '<td><strong>' + data.purchaseId + '</strong></td>' +
                    '<td>' + data.registrationDate + '</td>' +
                    '<td>' + data.registrationTime + '</td>' +
                    '<td>' + data.paymentDate + '</td>' +
                    '<td>' + data.paymentTime + '</td>' +
                    '<td>' + data.userId + '</td>' +
                    '<td>' + data.names + '</td>' +
                    '<td>' + data.lastName + '</td>' +
                    '<td>' + data.netAmount + '</td>' +
                    '<td>' + data.realPoints + '</td>' +
                    '<td>' + data.promotionPoints + '</td>' +
                    '<td>' + data.nameTypePurchase + '</td>' +
                    '<td>' + data.storeName + '</td>' +
                    '<td>' + data.typePayment + '</td>' +
                    '<td>' + data.statusPurchase + '</td>' +
                    '<td>' + data.shippingStatus + '</td>' +
                    '<td>' +
                    '<div value-hidden="' + data.purchaseId +'" class="showDetail">' +
                    '<a class= "btn btn-primary shadow btn-s sharp me-1" target="_blank">' +
                    '<i class="fa-solid fa-list"></i>' +
                    '</a>' +
                    '</div></td>' +
                    '<td>' +
                    '<div value-hidden="' + data.purchaseId +'" style="' + styleApprobeShipping + '" class="approbeShipping">' +
                    '<a class= "btn btn-primary shadow btn-s sharp me-1" target="_blank">' +
                    '<i class="fa-solid fa-check"></i>' +
                    '</a>' +
                    '</div></td>' +
                    '</tr>');
            });
            base.Function.UpdatePagination();
        },
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
        ClearFilters: function () {
            base.Control.txtStartDate().datepicker("setDate", new Date());
            base.Control.txtEndDate().datepicker("setDate", new Date());
            base.Control.txtUserName().val("");
            base.Control.txtUserId().val("");
            base.Control.txtPurchaseId().val("");
        },
        clsDetailPurchaseClick: function () {
            var parentElement = $(document);
            parentElement.on('click', '.showDetail', function () {
                base.Parameters.currentPageModal = 1;
                var purchaseId = $(this).attr('value-hidden');
                base.Parameters.purchaseId = purchaseId;
                base.Function.FillDataPurchaseDetailIntoModal(purchaseId);
            });
        },
        clsApprobeShippingClick: function () {
            var parentElement = $(document);
            parentElement.on('click', '.approbeShipping', function () {
                var purchaseId = $(this).attr('value-hidden');
                base.Ajax.AjaxApprobeShippingStatusPurchase.data = {
                    purchaseId: purchaseId
                };
                base.Ajax.AjaxApprobeShippingStatusPurchase.submit();
                
            });
        },
        FillDataPurchaseDetailIntoModal: function (purchaseId) {
            base.Ajax.AjaxGetPurchaseDetailForAdmin.data = {
                number: base.Parameters.currentPageModal,
                size: base.Parameters.sizePaginationModal,
                purchaseId: purchaseId
            };
            base.Ajax.AjaxGetPurchaseDetailForAdmin.submit();
        },
        FillDataDetailOrderIntoModal: function (listDetail) {
            base.Control.tbodyDetailPurchase().empty();
            listDetail.forEach(function (data) {
                base.Control.tbodyDetailPurchase().append('<tr style="text-align: center;">' +
                    '<td>' + data.productName + '</td>' +
                    '<td><img src="https://api.soynexora.com/StaticFiles/ProductsImg/' + data.imageName + '" style="height: 80px"></td>' +
                    '<td>' + data.quantity + '</td>' +
                    '<td>' + data.subtotalNetAmount + '</td>' +
                    '</tr>');
            });
            base.Function.UpdatePaginationModal();
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
                base.Function.GetDetailPurchasesAdmin();
            });
        },
        GetDetailPurchasesAdmin: function () {
            base.Ajax.AjaxGetPurchaseDetailForAdmin.data = {
                number: base.Parameters.currentPageModal,
                size: base.Parameters.sizePaginationModal,
                purchaseId: base.Parameters.purchaseId
            };
            base.Ajax.AjaxGetPurchaseDetailForAdmin.submit();
        },

    };
}