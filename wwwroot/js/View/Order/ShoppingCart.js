ns('Mitosiz.Site.ShoppingCart.Index')
Mitosiz.Site.ShoppingCart.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Function.clsNumberPagination();
        base.Function.clsAddNumber();
        base.Function.clsSubNumber();
        base.Function.clsUpdtToOrder();
        base.Function.clsDltToOrder();
        base.Function.GetOrder();
        base.Function.GetIndexInformationWholesale();
        base.Control.btnCompletedOrder().click(base.Event.btnCompletedOrderClick);
    };
    base.Parameters = {
        currentPage: 1,
        totalPages: 1,
        sizePagination: 5,
        productIdUpdate: 0,
        typePurchaseWholesaleId: 0,
        countProducts: 0
    };
    base.Control = {
        divPagination: function () { return $('#pagination'); },
        groupProducts: function () { return $('#groupProducts'); },
        lblNetAmount: function () { return $('#lblNetAmount'); },
        lblAvailableBalance: function () { return $('#lblAvailableBalance'); },
        lblTypePurchase: function () { return $('#lblTypePurchase'); },
        slcTypePayment: function () { return $('#slcTypePayment'); },
        liTypePayment: function () { return $('#liTypePayment'); },
        btnCompletedOrder: function () { return $('#btnCompletedOrder'); },
        divTypePurchase: function () { return $('#divTypePurchase'); },
        divAvailableBalance: function () { return $('#divAvailableBalance'); },
    };
    base.Event = {
        AjaxSaveOrderSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Function.ShowSwallSuccess("Pedido Realizado");
                }
                else {
                    if (!data.isSuccess && data.data != null) {
                        base.Function.ShowToastrError(data.data.message);
                    }
                    else {
                        base.Function.ShowToastrError(data.message);
                        //base.Function.ShowSwallConfirmAdditionalPurchase(data.message);
                    }
                }
            }
        },
        AjaxGetOrderSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPages = Math.ceil(data.data.orderWholesaleDetail.length / base.Parameters.sizePagination);
                    base.Parameters.typePurchaseWholesaleId = data.data.typePurchaseWholesaleId;
                    base.Parameters.countProducts = data.data.orderWholesaleDetail.length;
                    base.Control.lblTypePurchase().text(data.data.typePurchaseWholesaleName);
                    base.Control.lblNetAmount().text(data.data.netAmount);
                    base.Function.ListingProducts(data.data.orderWholesaleDetail);
                    if (data.data.typePurchaseWholesaleId == 1) {
                        //base.Control.liTypePayment().hide();
                        base.Control.liTypePayment().each(function () {
                            this.style.setProperty('display', 'none', 'important');
                        });
                    }
                    else {
                        base.Control.liTypePayment().show();
                    }
                }
            }
        },
        AjaxGetIndexInformationWholesaleSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.lblAvailableBalance().text(data.data.amount);
                    if (data.data.isWarehouse) {
                        base.Control.divTypePurchase().removeClass("d-flex").hide();
                        base.Control.divAvailableBalance().removeClass("d-flex").hide();
                    }
                }
            }
        },
        AjaxAddToOrderSuccess: function (data) {
            if (data) {
                if (data.data.isSuccess) {
                    var productId = base.Parameters.productIdUpdate;
                    $('#lblSubtotalNetAmount' + productId).text(data.data.newSubtotalAmount)
                    base.Control.lblNetAmount().text(data.data.netAmount);
                    base.Function.ShowToastr("Pedido Actualizado");
                }
                else {
                    if (data.data.amountExceeded) {
                        base.Function.ShowSwallConfirmAdditionalPurchase(data.data.message);
                    }
                    else {
                        base.Function.ShowToastrError(data.data.message);
                    }
                }
            }
        },
        AjaxRemoveFromOrderSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPages = Math.ceil(data.data.orderWholesaleDetail.length / base.Parameters.sizePagination);
                    base.Control.lblNetAmount().text(data.data.netAmount);
                    base.Function.ListingProducts(data.data.orderWholesaleDetail);
                    base.Function.ShowToastr("Producto Eliminado");
                    if (data.data.orderWholesaleDetail.length == 0) {
                        window.location.href = Mitosiz.Site.ShoppingCart.Actions.RedirectOrder;
                    }
                }
            }
        },
        btnCompletedOrderClick: function () {
            if (base.Parameters.countProducts > 0) {
                base.Ajax.AjaxSaveOrder.data = {
                    typePayment: base.Control.slcTypePayment().find('option:selected').text()
                };
                base.Ajax.AjaxSaveOrder.submit();
            }
            else {
                base.Function.ShowToastrError("Por favor, agregue productos al carrito");
            }
        },
    };
    base.Ajax = {
        AjaxSaveOrder: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.ShoppingCart.Actions.SaveOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxSaveOrderSuccess
        }),
        AjaxGetOrder: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.ShoppingCart.Actions.GetOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetOrderSuccess
        }),
        AjaxGetIndexInformationWholesale: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.ShoppingCart.Actions.GetIndexInformationWholesale,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetIndexInformationWholesaleSuccess
        }),
        AjaxAddToOrder: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.ShoppingCart.Actions.AddToOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxAddToOrderSuccess
        }),
        AjaxRemoveFromOrder: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.ShoppingCart.Actions.RemoveFromOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxRemoveFromOrderSuccess
        }),
    };
    base.Function = {
        ShowToastrError: function (message) {
            toastr.error("" + message + "", "Opps", {
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
        ShowSwallSuccess: function (message) {
            Swal.fire("Excelente !!", message, "success").then((result) => {
                window.location.href = Mitosiz.Site.ShoppingCart.Actions.RedirectOrder;
            });
        },
        ShowSwallConfirmAdditionalPurchase: function (message) {
            Swal.fire({
                title: message,
                text: "Esto no se puede revertir!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, generar adicional"
            }).then((result) => {
                if (result.isConfirmed) {
                    base.Ajax.AjaxAddToOrder.data = {
                        quantity: quantity,
                        productId: productId,
                        process: 'Edit',
                        typePurchaseId: base.Parameters.typePurchaseWholesaleId
                    };
                    base.Ajax.AjaxAddToOrder.submit();
                }
            });
        },
        clsNumberPagination: function () {
            var parentElement = $(document);
            parentElement.on('click', '.page-link', function () {
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
                base.Function.GetProducts();
            });
        },
        clsAddNumber: function () {
            var parentElement = $(document);
            parentElement.on('click', '.add-number', function () {
                var valueAdd = parseInt($(this).attr('value-hidden'));
                var newQuantity = parseInt($('#txtNumber' + valueAdd).val()) + 1;
                $('#txtNumber' + valueAdd).val(newQuantity)
            });
        },
        clsSubNumber: function () {
            var parentElement = $(document);
            parentElement.on('click', '.sub-number', function () {
                var valueAdd = parseInt($(this).attr('value-hidden'));
                var newQuantity = parseInt($('#txtNumber' + valueAdd).val()) - 1;
                if (newQuantity > 0) {
                    $('#txtNumber' + valueAdd).val(newQuantity)
                }
            });
        },
        clsUpdtToOrder: function () {
            var parentElement = $(document);
            parentElement.on('click', '.updtToOrder', function () {
                var productId = parseInt($(this).attr('value-hidden'));
                base.Parameters.productIdUpdate = productId;
                var quantity = parseInt($('#txtNumber' + productId).val());
                base.Ajax.AjaxAddToOrder.data = {
                    quantity: quantity,
                    productId: productId,
                    process: 'Edit',
                    typePurchaseId: base.Parameters.typePurchaseWholesaleId
                };
                base.Ajax.AjaxAddToOrder.submit();
            });
        },
        clsDltToOrder: function () {
            var parentElement = $(document);
            parentElement.on('click', '.dltToOrder', function () {
                var productId = parseInt($(this).attr('value-hidden'));
                base.Ajax.AjaxRemoveFromOrder.data = {
                    productId: productId,
                };
                base.Ajax.AjaxRemoveFromOrder.submit();
            });
        },
        GetOrder: function () {
            base.Ajax.AjaxGetOrder.submit();
        },
        GetIndexInformationWholesale: function () {
            base.Ajax.AjaxGetIndexInformationWholesale.submit();
        },
        UpdatePagination: function () {
            base.Control.divPagination().empty();
            base.Control.divPagination().append('<li class="page-item page-indicator"><a class="page-link" href="#" id="prev">«</a></li>');

            if (base.Parameters.totalPages <= 5) {
                for (var i = 1; i <= base.Parameters.totalPages; i++) {
                    var classBackground = (i === base.Parameters.currentPage) ? 'backgroundPurpleButtonMitosiz' : '';
                    base.Control.divPagination().append('<li class="page-item ' + (i === base.Parameters.currentPage ? 'active' : '') + '"><a class="page-link ' + classBackground + '" href="#">' + i + '</a></li>');
                }
            } else {
                var startPage = Math.max(1, base.Parameters.currentPage - 2);
                var endPage = Math.min(base.Parameters.totalPages, base.Parameters.currentPage + 2);

                if (base.Parameters.currentPage >= base.Parameters.totalPages - 2) {
                    startPage = base.Parameters.totalPages - 4;
                }

                if (startPage > 1) {
                    base.Control.divPagination().append('<li class="page-item"><a class="page-link" href="#">1</a></li>');
                    if (startPage > 2) {
                        if (base.Parameters.currentPage != base.Parameters.totalPages) {
                            endPage--;
                        }
                        startPage++;
                        var valueHidden = startPage - 1;
                        base.Control.divPagination().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden + '" class="page-link" href="#">..</a></li>');
                    }
                }

                for (var i = startPage; i <= endPage; i++) {
                    base.Control.divPagination().append('<li class="page-item ' + (i === base.Parameters.currentPage ? 'active' : '') + '"><a class="page-link" href="#">' + i + '</a></li>');
                }

                if (endPage < base.Parameters.totalPages) {
                    if (endPage < base.Parameters.totalPages - 1) {
                        var valueHidden = endPage + 1;
                        base.Control.divPagination().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden + '" class="page-link" href="#">..</a></li>');
                    }
                    base.Control.divPagination().append('<li class="page-item"><a class="page-link " href="#">' + base.Parameters.totalPages + '</a></li>');
                }
            }

            base.Control.divPagination().append('<li class="page-item page-indicator"><a class="page-link" href="#" id="next">»</a></li>');
        },
        ListingProducts: function (productsOrder) {
            base.Control.groupProducts().empty();
            var $groupProducts = $('#groupProducts');
            productsOrder.forEach(function (product) {
                var productHtml = `
                <li class="list-group-item d-flex justify-content-center" style="flex-wrap: wrap;">
				    <div class="col-xl-3 col-sm-6" style="display: flex;justify-content: center; height: 100px;">
				    	<img class="img-fluid" src="https://api.soynexora.com/StaticFiles/ProductsImg/${product.imageName}" alt="">
				    </div>
				    <div class="col-xl-3 col-sm-6" style="display: flex;justify-content: center; align-items: center;padding-top: inherit;">
				    	<h5 class="my-0">${product.productName}</h5>
				    </div>
				    <div class="col-xl-3 col-sm-6" style="display: flex;justify-content: center; align-items: center;padding-top: inherit;">
				    	<button value-hidden="${product.productId}" class="btn btn-primary backgroundPurpleButtonMitosiz sharp sub-number" style="color:white;margin-right: 0.0rem;">-</button>
				    	<input type="text" id="txtNumber${product.productId}" value="${product.quantity}" class="form-control input-number" style="margin-left: 0.7rem; margin-right: 0.7rem;text-align: center;" />
				    	<button value-hidden="${product.productId}" class="btn btn-primary backgroundPurpleButtonMitosiz sharp add-number" style="color:white;margin-right: 0.0rem;">+</button>
                        <button value-hidden="${product.productId}" class="btn btn-primary backgroundYellowButtonMitosiz sharp updtToOrder" style="color:white;margin-left: 5px;"><i class="fa-solid fa-arrows-rotate"></i></button>
				    </div>
				    <div class="col-xl-2 col-sm-6" style="display: flex;justify-content: center; align-items: center;padding-right: inherit; padding-top: inherit;">
				    	<h5>S/<a id="lblSubtotalNetAmount${product.productId}">${product.subtotalNetAmount}</a></h5>
				    </div>
                    <div class="col-xl-1 col-sm-6" style="display: flex;justify-content: center; align-items: center;padding-top: inherit;">
                        <button value-hidden="${product.productId}" class="btn btn-primary backgroundRedButtonMitosiz sharp dltToOrder" style="color:white;margin-left: 5px;"><i class="fa-solid fa-trash"></i></button>
				    </div>
				</li>
                `;
                $groupProducts.append(productHtml);
            });
            base.Function.UpdatePagination();
        }
    };
};