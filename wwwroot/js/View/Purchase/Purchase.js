ns('Mitosiz.Site.Purchase.Index')
Mitosiz.Site.Purchase.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Function.GetPurchasesAdmin();
        base.Function.clsNumberPagination();
        base.Function.clsNumberPaginationModal();
        base.Function.clsUpdateDataClick();
        base.Function.clsDeletePurchaseClick();
        base.Control.btnSearch().click(base.Event.btnSearchClick);
        base.Control.btnClear().click(base.Event.btnClearClick);
        base.Control.btnUpdateModal().click(base.Event.btnUpdateModalClick);
        base.Control.btnReportPurchase().click(base.Event.btnReportPurchaseClick);
        base.Control.btnReportDetailPurchase().click(base.Event.btnReportDetailPurchaseClick);
        base.Ajax.AjaxGetTypePurchases.submit();
        base.Ajax.AjaxGetTypePayments.submit();
        base.Ajax.AjaxGetStores.submit();
    };
    base.Parameters = {
        currentPage: 1,
        currentPageModal: 1,
        totalPages: 1,
        totalPagesModal: 1,
        sizePagination: 10,
        sizePaginationModal: 4
    };
    base.Control = {
        divPagination: function () { return $('#pagination'); },
        divPaginationModal: function () { return $('#paginationModal'); },
        tbodyTable: function () { return $('#tbodyPurchase'); },
        tbodyDetailPurchase: function () { return $('#tbodyDetailPurchase'); },
        txtUserId: function () { return $('#txtUserId'); },
        txtUserName: function () { return $('#txtUserName'); },
        txtPurchaseIdFilter: function () { return $('#txtPurchaseIdFilter'); },
        txtStartDate: function () { return $('#txtStartDate'); },
        txtEndDate: function () { return $('#txtEndDate'); },
        btnSearch: function () { return $('#btnSearch'); },
        btnClear: function () { return $('#btnClear'); },
        modalUpdate: function () { return $('#modalUpdate'); },
        slcTypePurchase: function () { return $('#slcTypePurchase'); },
        slcStore: function () { return $('#slcStore'); },
        slcTypePayment: function () { return $('#slcTypePayment'); },
        txtPurchaseId: function () { return $('#txtPurchaseId'); },
        txtRegistrationDate: function () { return $('#txtRegistrationDate'); },
        txtRealPoints: function () { return $('#txtRealPoints'); },
        txtPromotionPoints: function () { return $('#txtPromotionPoints'); },
        slcStatusPurchase: function () { return $('#slcStatusPurchase'); },
        slcShippingStatus: function () { return $('#slcShippingStatus'); },
        btnUpdateModal: function () { return $('#btnUpdateModal'); },
        btnReportPurchase: function () { return $('#btnReportPurchase'); },
        btnReportDetailPurchase: function () { return $('#btnReportDetailPurchase'); },
    };
    base.Event = {
        AjaxGetPurchasesAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPages = data.data.totalPages;
                    base.Function.FillData(data.data.purchaseForAdmin);
                }
            }
        },
        AjaxGetPurchaseDetailForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPagesModal = data.data.totalPages;
                    base.Function.FillDataDetailPurchaseIntoModal(data.data.purchaseDetailForAdmin);
                }
            }
        },
        AjaxGetTypePurchasesSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcTypePurchase().empty();
                    $.each(data.data, function (key, value) {
                        base.Control.slcTypePurchase().append($('<option>', {
                            value: value.typePurchaseId,
                            text: value.nameTypePurchase
                        }));
                    });
                    base.Control.slcTypePurchase().selectpicker('refresh');
                }
            }
        },
        AjaxGetTypePaymentsSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcTypePayment().empty();
                    $.each(data.data, function (key, value) {
                        base.Control.slcTypePayment().append($('<option>', {
                            value: value.typePaymentId,
                            text: value.description
                        }));
                    });
                    base.Control.slcTypePayment().selectpicker('refresh');
                }
            }
        },
        AjaxGetStoresSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcStore().empty();
                    $.each(data.data, function (key, value) {
                        base.Control.slcStore().append($('<option>', {
                            value: value.storeId,
                            text: value.storeName
                        }));
                    });
                    base.Control.slcStore().selectpicker('refresh');
                }
            }
        },
        AjaxGetEditPurchaseAndDetailSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    var dateString = data.data.creationTime.split(' ')[0];
                    base.Control.txtPurchaseId().val(data.data.purchaseId);
                    base.Control.txtRegistrationDate().val(dateString);
                    base.Control.txtRegistrationDate().datepicker({
                        autoclose: true
                    }).datepicker("setDate", dateString);
                    base.Control.txtRealPoints().val(data.data.realPoints);
                    base.Control.txtPromotionPoints().val(data.data.promotionPoints);
                    base.Control.slcTypePurchase().val(data.data.typePurchaseId);
                    base.Control.slcTypePurchase().selectpicker('refresh');
                    base.Control.slcStore().val(data.data.storeId);
                    base.Control.slcStore().selectpicker('refresh');
                    $("#slcTypePayment option:contains('" + data.data.typePayment + "')").prop("selected", true);
                    base.Control.slcTypePayment().selectpicker('refresh');
                    base.Control.slcStatusPurchase().val(data.data.statusPurchase);
                    base.Control.slcStatusPurchase().selectpicker('refresh');
                    base.Control.slcShippingStatus().val(data.data.shippingStatus);
                    base.Control.slcShippingStatus().selectpicker('refresh');
                    base.Parameters.totalPagesModal = data.data.purchaseDetailPagination.totalPages;
                    base.Function.FillDataDetailPurchaseIntoModal(data.data.purchaseDetailPagination.purchaseDetailForAdmin);
                    base.Control.modalUpdate().modal('show');
                }
            }
        },
        AjaxUpdatePurchseForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    Swal.fire("Excelente !!", "La compra fue actualizada !!", "success")
                    base.Control.modalUpdate().modal('hide');
                    base.Function.GetPurchasesAdmin();
                }
                else {
                    Swal.fire("Oops...", "Ocurrió un error, Por favor intententelo nuevamente", "error") 
                }
            }
        },
        AjaxGeneratePurchaseReportSuccess: function (data) {
            if (data) {
                window.open('https://api.soynexora.com/StaticFiles/ReportPurchases/' + data.data);
            }
        },
        AjaxGenerateDetailPurchaseReportSuccess: function (data) {
            if (data) {
                window.open('https://api.soynexora.com/StaticFiles/ReportDetailPurchases/' + data.data);
            }
        },
        AjaxDeletePurchaseSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    Swal.fire("Excelente !!", "La compra fue eliminada !!", "success")
                    base.Function.GetPurchasesAdmin();
                }
                else {
                    Swal.fire("Oops...", "Ocurrió un error, Por favor intententelo nuevamente", "error")
                    base.Function.GetPurchasesAdmin();
                }
            }
        },
        btnSearchClick: function () {
            var userId = (base.Control.txtUserId().val() == "") ? 0 : parseInt(base.Control.txtUserId().val());
            var purchaseId = (base.Control.txtPurchaseIdFilter().val() == "") ? 0 : parseInt(base.Control.txtPurchaseIdFilter().val());
            base.Parameters.currentPage = 1;
            base.Ajax.AjaxGetPurchasesAdmin.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                userId: userId,
                purchaseId: purchaseId,
                names: base.Control.txtUserName().val(),
                startDateString: base.Control.txtStartDate().val(),
                endDateString: base.Control.txtEndDate().val()
            };
            base.Ajax.AjaxGetPurchasesAdmin.submit();
        },
        btnClearClick: function () {
            base.Function.ClearFilters();
            var userId = (base.Control.txtUserId().val() == "") ? 0 : parseInt(base.Control.txtUserId().val());
            var purchaseId = (base.Control.txtPurchaseIdFilter().val() == "") ? 0 : parseInt(base.Control.txtPurchaseIdFilter().val());
            base.Parameters.currentPage = 1;
            base.Ajax.AjaxGetPurchasesAdmin.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                userId: userId,
                purchaseId: purchaseId,
                names: base.Control.txtUserName().val(),
                startDateString: base.Control.txtStartDate().val(),
                endDateString: base.Control.txtEndDate().val()
            };
            base.Ajax.AjaxGetPurchasesAdmin.submit();
        },
        btnUpdateModalClick: function () {
            base.Ajax.AjaxUpdatePurchseForAdmin.data = {
                purchaseId: base.Control.txtPurchaseId().val(),
                creationTime: base.Control.txtRegistrationDate().val(),
                realPoints: base.Control.txtRealPoints().val(),
                promotionPoints: base.Control.txtPromotionPoints().val(),
                typePurchaseId: base.Control.slcTypePurchase().val(),
                storeId: base.Control.slcStore().val(),
                typePayment: base.Control.slcTypePayment().find('option:selected').text(),
                statusPurchase: base.Control.slcStatusPurchase().find('option:selected').text(),
                shippingStatus: base.Control.slcShippingStatus().find('option:selected').text()
            };
            base.Ajax.AjaxUpdatePurchseForAdmin.submit();
        },
        btnReportPurchaseClick: function () {
            var userId = (base.Control.txtUserId().val() == "") ? 0 : parseInt(base.Control.txtUserId().val());
            var purchaseId = (base.Control.txtPurchaseIdFilter().val() == "") ? 0 : parseInt(base.Control.txtPurchaseIdFilter().val());
            base.Ajax.AjaxGeneratePurchaseReport.data = {
                userId: userId,
                purchaseId: purchaseId,
                names: base.Control.txtUserName().val(),
                startDateString: base.Control.txtStartDate().val(),
                endDateString: base.Control.txtEndDate().val()
            };
            base.Ajax.AjaxGeneratePurchaseReport.submit();
        },
        btnReportDetailPurchaseClick: function () {
            var userId = (base.Control.txtUserId().val() == "") ? 0 : parseInt(base.Control.txtUserId().val());
            var purchaseId = (base.Control.txtPurchaseIdFilter().val() == "") ? 0 : parseInt(base.Control.txtPurchaseIdFilter().val());
            base.Ajax.AjaxGenerateDetailPurchaseReport.data = {
                userId: userId,
                purchaseId: purchaseId,
                names: base.Control.txtUserName().val(),
                startDateString: base.Control.txtStartDate().val(),
                endDateString: base.Control.txtEndDate().val()
            };
            base.Ajax.AjaxGenerateDetailPurchaseReport.submit();
        },
    };
    base.Ajax = {
        AjaxGetPurchasesAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Purchase.Actions.GetDataPurchase,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetPurchasesAdminSuccess
        }),
        AjaxGetTypePurchases: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Purchase.Actions.GetTypePurchases,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetTypePurchasesSuccess
        }),
        AjaxGetTypePayments: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Purchase.Actions.GetTypePayments,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetTypePaymentsSuccess
        }),
        AjaxGetStores: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Purchase.Actions.GetStores,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetStoresSuccess
        }),
        AjaxGetEditPurchaseAndDetail: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Purchase.Actions.GetEditPurchaseAndDetail,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetEditPurchaseAndDetailSuccess
        }),
        AjaxUpdatePurchseForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Purchase.Actions.UpdatePurchseForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxUpdatePurchseForAdminSuccess
        }),
        AjaxGetPurchaseDetailForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Purchase.Actions.GetPurchaseDetailForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetPurchaseDetailForAdminSuccess
        }),
        AjaxGeneratePurchaseReport: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Purchase.Actions.GeneratePurchaseReport,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGeneratePurchaseReportSuccess
        }),
        AjaxGenerateDetailPurchaseReport: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Purchase.Actions.GenerateDetailPurchaseReport,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGenerateDetailPurchaseReportSuccess
        }),
        AjaxDeletePurchase: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Purchase.Actions.DeletePurchase,
            autoSubmit: false,
            onSuccess: base.Event.AjaxDeletePurchaseSuccess
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
                base.Function.GetPurchasesAdmin();
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
                base.Function.GetDetailPurchasesAdmin();
            });
        },
        GetPurchasesAdmin: function () {
            var userId = (base.Control.txtUserId().val() == "") ? 0 : parseInt(base.Control.txtUserId().val());
            var purchaseId = (base.Control.txtPurchaseIdFilter().val() == "") ? 0 : parseInt(base.Control.txtPurchaseIdFilter().val());
            base.Ajax.AjaxGetPurchasesAdmin.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                userId: userId,
                purchaseId: purchaseId,
                names: base.Control.txtUserName().val(),
                startDateString: base.Control.txtStartDate().val(),
                endDateString: base.Control.txtEndDate().val()
            };
            base.Ajax.AjaxGetPurchasesAdmin.submit();
        },
        GetDetailPurchasesAdmin: function () {
            base.Ajax.AjaxGetPurchaseDetailForAdmin.data = {
                number: base.Parameters.currentPageModal,
                size: base.Parameters.sizePaginationModal,
                purchaseId: base.Control.txtPurchaseId().val()
            };
            base.Ajax.AjaxGetPurchaseDetailForAdmin.submit();
        },
        FillData: function (listData) {
            base.Control.tbodyTable().empty();
            listData.forEach(function (data) {
                var urlVoucher = 'https://api.soynexora.com/StaticFiles/PaymentImg/' + data.voucher;
                var styleVoucher = data.voucher == '' ? "display:none;" : "";
                var styleDelete = data.statusPurchase == 'Evaluación' || data.statusPurchase == 'Realizada' ? "display:none;" : "";
                base.Control.tbodyTable().append('<tr style="text-align: center;">' +
                    '<td>' +
                    '<div class="dropdown">' +
                    '<button type="button" class="btn btn-success light sharp" data-bs-toggle="dropdown">' +
                    '<svg width="20px" height="20px" viewBox="0 0 24 24" version="1.1">' +
                    '<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">' +
                    '<rect x="0" y="0" width="24" height="24" /><circle fill="#000000" cx="5" cy="12" r="2" /><circle fill="#000000" cx="12" cy="12" r="2" /><circle fill="#000000" cx="19" cy="12" r="2" />' +
                    '</g>' +
                    '</svg>' +
                    '</button>' +
                    '<div class="dropdown-menu">' +
                    '<a class="dropdown-item updateData" value="' + data.purchaseId + '" href="#">Actualizar</a>' +
                    '<a class="dropdown-item deleteData" style="' + styleDelete +'" value="' + data.purchaseId + '" href="#">Eliminar</a>' +
                    '</div>' +
                    '</div></td>' +
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
                    '<div style="' + styleVoucher +'">' +
                    '<a href = "' + urlVoucher +'" class= "btn btn-primary shadow btn-s sharp me-1" target="_blank">' +
                            '<i class="fa-solid fa-ticket"></i>' +
                        '</a>' +
                    '</div></td>' +
                    '</tr>');
            });
            base.Function.UpdatePagination();
        },
        clsUpdateDataClick: function () {
            var parentElement = $(document);
            parentElement.on('click', '.updateData', function () {
                base.Parameters.currentPageModal = 1;
                var purchaseId = $(this).attr('value');
                base.Function.FillDataPurchaseIntoModal(purchaseId);
            });
        },
        clsDeletePurchaseClick: function () {
            var parentElement = $(document);
            parentElement.on('click', '.deleteData', function () {
                var purchaseId = $(this).attr('value');
                Swal.fire({
                    title: "Estás segur@ de eliminar la compra?",
                    text: "Esto no se puede revertir!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si, eliminar!"
                }).then((result) => {
                    if (result.isConfirmed) {
                        base.Ajax.AjaxDeletePurchase.data = {
                            purchaseId: purchaseId
                        };
                        base.Ajax.AjaxDeletePurchase.submit();
                    }
                });
            });
        },
        FillDataPurchaseIntoModal: function (purchaseId) {
            base.Ajax.AjaxGetEditPurchaseAndDetail.data = {
                number: base.Parameters.currentPageModal,
                size: base.Parameters.sizePaginationModal,
                purchaseId: purchaseId
            };
            base.Ajax.AjaxGetEditPurchaseAndDetail.submit();
        },
        ClearFilters: function () {
            base.Control.txtUserId().val("");
            base.Control.txtPurchaseIdFilter().val("");
            base.Control.txtUserName().val("");
            base.Control.txtStartDate().datepicker("setDate", new Date());
            base.Control.txtEndDate().datepicker("setDate", new Date());
        },
        FillDataDetailPurchaseIntoModal: function (listDetail) {
            base.Control.tbodyDetailPurchase().empty();
            listDetail.forEach(function (data) {
                base.Control.tbodyDetailPurchase().append('<tr style="text-align: center;">' +
                    '<td>' + data.productName + '</td>' +
                    '<td><img src="https://api.soynexora.com/StaticFiles/ProductsImg/' + data.imageName + '" style="height: 80px"></td>' +
                    '<td>' + data.quantity + '</td>' +
                    '<td>' + data.subtotalNetAmount + '</td>' +
                    '<td>' + data.subtotalPoints + '</td>' +
                    '<td>' + data.subtotalPointsNetwork + '</td>' +
                    '</tr>');
            });
            base.Function.UpdatePaginationModal();
        }
    };
}