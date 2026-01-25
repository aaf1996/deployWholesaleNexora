ns('Mitosiz.Site.StoreInventory.Index')
Mitosiz.Site.StoreInventory.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Function.GetLogin();
        base.Function.clsNumberPagination();
        base.Control.btnSearch().click(base.Event.btnSearchClick);
        base.Control.btnClear().click(base.Event.btnClearClick);
        base.Control.btnReport().click(base.Event.btnReportClick);
    };
    base.Parameters = {
        storeId: 0,
        currentPage: 1,
        totalPages: 1,
        sizePagination: 10,
    };
    base.Control = {
        txtProductName: function () { return $('#txtProductName'); },
        divPagination: function () { return $('#pagination'); },
        tbodyTable: function () { return $('#tbodyStock'); },
        btnSearch: function () { return $('#btnSearch'); },
        btnReport: function () { return $('#btnReport'); },
        btnClear: function () { return $('#btnClear'); },
    };
    base.Event = {
        AjaxGetLoginSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.storeId = data.data.storeId;
                    base.Function.GetStoreInventory();
                }
            }
        },
        AjaxGetDetailStoreInventoryByStoreIdSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPages = data.data.totalPages;
                    base.Function.FillData(data.data.stockByStoreIdForAdmin);
                }
            }
        },
        AjaxGenerateStoreInventoryReportSuccess: function (data) {
            if (data) {
                window.open('https://api.soynexora.com/StaticFiles/ReportStoreInventory/' + data.data);
            }
        },
        btnSearchClick: function () {
            base.Parameters.currentPage = 1;
            base.Ajax.AjaxGetDetailStoreInventoryByStoreId.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                storeId: base.Parameters.storeId,
                productName: base.Control.txtProductName().val()
            };
            base.Ajax.AjaxGetDetailStoreInventoryByStoreId.submit();
        },
        btnClearClick: function () {
            base.Function.ClearFilters();
            base.Parameters.currentPage = 1;
            base.Ajax.AjaxGetDetailStoreInventoryByStoreId.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                storeId: base.Parameters.storeId,
                productName: base.Control.txtProductName().val()
            };
            base.Ajax.AjaxGetDetailStoreInventoryByStoreId.submit();
        },
        btnReportClick: function () {
            base.Ajax.AjaxGenerateStoreInventoryReport.data = {
                storeId: base.Parameters.storeId
            };
            base.Ajax.AjaxGenerateStoreInventoryReport.submit();
        },
    };
    base.Ajax = {
        AjaxGetLogin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.StoreInventory.Actions.GetLogin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetLoginSuccess
        }),
        AjaxGetDetailStoreInventoryByStoreId: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.StoreInventory.Actions.GetDetailStoreInventoryByStoreId,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetDetailStoreInventoryByStoreIdSuccess
        }),
        AjaxGenerateStoreInventoryReport: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.StoreInventory.Actions.GenerateStoreInventoryReport,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGenerateStoreInventoryReportSuccess
        }),
    };
    base.Function = {
        GetLogin: function () {
            base.Ajax.AjaxGetLogin.submit();
        },
        GetStoreInventory: function () {
            base.Ajax.AjaxGetDetailStoreInventoryByStoreId.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                storeId: base.Parameters.storeId,
                productName: base.Control.txtProductName().val()
            };
            base.Ajax.AjaxGetDetailStoreInventoryByStoreId.submit();
        },
        FillData: function (listData) {
            base.Control.tbodyTable().empty();
            listData.forEach(function (data) {
                base.Control.tbodyTable().append('<tr style="text-align: center;">' +
                    '<td><img src="https://api.soynexora.com/StaticFiles/ProductsImg/' + data.imageName + '" style="height: 80px"></td>' +
                    '<td>' + data.productName + '</td>' +
                    '<td>' + data.realStock + '</td>' +
                    '<td>' + data.stockShippingPending + '</td>' +
                    '<td>' + data.physicalStock + '</td>' +
                    '<td>' + data.purchasePending + '</td>' +
                    '<td>' + data.expectedPendingPurchases + '</td>' +
                    '<td>' + data.pricePartner + '</td>' +
                    '<td>' + data.priceRealStock + '</td>' +
                    '<td>' + data.products_LastPeriod + '</td>' +
                    '<td>' + data.products_Previous1 + '</td>' +
                    '<td>' + data.products_Previous2 + '</td>' +
                    '<td>' + data.avgProducts + '</td>' +
                    '<td>' + data.scopeStock + '</td>' +
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
                base.Function.GetStoreInventory();
            });
        },
        ClearFilters: function () {
            base.Control.txtProductName().val("");
        },
        ShowToastr: function (message) {
            toastr.success("" + message + "", "Excelente", {
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