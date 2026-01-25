function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
};
ns('Mitosiz.Site.Order.Index')
Mitosiz.Site.Order.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Ajax.AjaxGetTypePurchaseWholesaleForOrder.submit();
        base.Function.GetProducts();
        base.Function.clsAddNumber();
        base.Function.clsSubNumber();
        base.Function.clsNumberPagination();
        base.Function.clsAddToOrder();
        base.Function.GetIndexInformationWholesale();
        base.Control.btnShoppingCart().click(base.Event.btnShoppingCartClick);
        base.Control.txtProduct().keyup(base.Event.txtProductKeyUp);
        base.Control.slcTypePurchase().change(base.Event.slcTypePurchaseChange);
    };
    base.Parameters = {
        currentPage: 1,
        totalPages: 1,
        sizePagination: 12,
        countProducts: 0,
        productIdSelected: 0,
        isWarehouse: false
    };
    base.Control = {
        divPagination: function () { return $('#pagination'); },
        productContainer : function () { return $('#product-container'); },
        lblNetAmount: function () { return $('#lblNetAmount'); },
        lblAvailableBalance: function () { return $('#lblAvailableBalance'); },
        btnShoppingCart: function () { return $('#btnShoppingCart'); },
        txtProduct: function () { return $('#txtProduct'); },
        slcTypePurchase: function () { return $('#slcTypePurchase'); },
        divTypePurchase: function () { return $('#divTypePurchase'); },
        divAvailableBalance: function () { return $('#divAvailableBalance'); },
    };
    base.Event = {
        AjaxGetProductsForOrderSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPages = data.data.totalPages;
                    base.Function.ListingProducts(data.data.productStore);
                }
            }
        },
        AjaxGetOrderSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.lblNetAmount().text(data.data.netAmount);
                    base.Parameters.countProducts = data.data.orderWholesaleDetail.length;
                    base.Control.slcTypePurchase().val(data.data.typePurchaseWholesaleId);
                    base.Control.slcTypePurchase().selectpicker('refresh');
                }
            }
        },
        AjaxGetIndexInformationWholesaleSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.lblAvailableBalance().text(data.data.amount);
                    if (data.data.isWarehouse) {
                        base.Parameters.isWarehouse = true;
                        base.Control.divTypePurchase().hide();
                        base.Control.divAvailableBalance().hide();
                    }
                }
            }
        },
        AjaxSetTypePurchaseSessionSuccess: function (data) {
            if (data) {
                if (data.data.isSuccess) {
                    base.Control.slcTypePurchase().val(data.data.typePurchaseWholesaleId);
                    base.Control.slcTypePurchase().selectpicker('refresh');
                }
                else {
                    base.Control.slcTypePurchase().val(data.data.typePurchaseWholesaleId);
                    base.Control.slcTypePurchase().selectpicker('refresh');
                    base.Function.ShowToastrError(data.data.message);
                }
            }
        },
        AjaxAddToOrderSuccess: function (data) {
            if (data) {
                if (data.data.isSuccess) {
                    base.Control.lblNetAmount().text(data.data.netAmount);
                    base.Parameters.countProducts = data.data.quantity;
                    base.Function.ShowToastr("Producto Agregado");
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
        AjaxGetTypePurchaseWholesaleForOrderSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcTypePurchase().empty();
                    base.Control.slcTypePurchase().append($('<option>', {
                        value: 0,
                        text: 'Seleccione'
                    }));
                    $.each(data.data, function (key, value) {
                        base.Control.slcTypePurchase().append($('<option>', {
                            value: value.typePurchaseWholesaleId,
                            text: value.nameTypePurchase
                        }));
                    });
                    base.Control.slcTypePurchase().selectpicker('refresh');
                    base.Function.GetOrder();
                }
            }
        },
        btnShoppingCartClick: function () {
            if (base.Parameters.countProducts > 0) {
                window.location.href = Mitosiz.Site.Order.Actions.RedirectShoppingCart;
            }
            else {
                base.Function.ShowToastrError("Por favor, agregue productos al carrito");
            }
        },
        slcTypePurchaseChange: function () {
            var name = $(this).find('option:selected').text();
            var typePurchaseId = $(this).val();
            base.Ajax.AjaxSetTypePurchaseSession.data = {
                typePurchaseName: name,
                typePurchaseId: typePurchaseId
            };
            base.Ajax.AjaxSetTypePurchaseSession.submit();
        },
        txtProductKeyUp: debounce(function () {
            var productName = this.value;
            if (productName == '' || productName.length >= 3) {
                base.Ajax.AjaxGetProductsForOrder.data = {
                    number: base.Parameters.currentPage,
                    size: base.Parameters.sizePagination,
                    productName: productName
                };
                base.Ajax.AjaxGetProductsForOrder.submit();
            }
        }, 300),
    };
    base.Ajax = {
        AjaxGetProductsForOrder: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Order.Actions.GetProductsForOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetProductsForOrderSuccess
        }),
        AjaxGetOrder: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Order.Actions.GetOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetOrderSuccess
        }),
        AjaxGetIndexInformationWholesale: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Order.Actions.GetIndexInformationWholesale,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetIndexInformationWholesaleSuccess
        }),
        AjaxSetTypePurchaseSession: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Order.Actions.SetTypePurchaseSession,
            autoSubmit: false,
            onSuccess: base.Event.AjaxSetTypePurchaseSessionSuccess
        }),
        AjaxAddToOrder: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Order.Actions.AddToOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxAddToOrderSuccess
        }),
        AjaxGetTypePurchaseWholesaleForOrder: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Order.Actions.GetTypePurchaseWholesaleForOrder,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetTypePurchaseWholesaleForOrderSuccess
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
                    base.Control.slcTypePurchase().val(4);
                    base.Control.slcTypePurchase().selectpicker('refresh');

                    var productId = base.Parameters.productIdSelected;
                    var quantity = parseInt($('#txtNumber' + productId).val());

                    base.Ajax.AjaxAddToOrder.data = {
                        quantity: quantity,
                        productId: productId,
                        process: 'Addition',
                        typePurchaseId: base.Control.slcTypePurchase().val(),
                        typePurchaseName: base.Control.slcTypePurchase().find('option:selected').text()
                    };
                    base.Ajax.AjaxAddToOrder.submit();
                }
            });
        },
        UpdatePagination: function () {
            base.Control.divPagination().empty();
            base.Control.divPagination().append('<li class="page-item page-indicator"><a class="page-link" href="#" id="prev">«</a></li>');

            if (base.Parameters.totalPages <= 5) {
                for (var i = 1; i <= base.Parameters.totalPages; i++) {
                    var classBackground = (i === base.Parameters.currentPage) ? 'backgroundPurpleButtonMitosiz': '';
                    base.Control.divPagination().append('<li class="page-item ' + (i === base.Parameters.currentPage ? 'active' : '') + '"><a class="page-link '+classBackground+'" href="#">' + i + '</a></li>');
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
        clsAddNumber : function () {
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
        GetOrder: function () {
            base.Ajax.AjaxGetOrder.submit();
        },
        GetIndexInformationWholesale: function () {
            base.Ajax.AjaxGetIndexInformationWholesale.submit();
        },
        clsAddToOrder: function () {
            var parentElement = $(document);
            parentElement.on('click', '.addToOrder', function () {
                var productId = parseInt($(this).attr('value-hidden'));
                var quantity = parseInt($('#txtNumber' + productId).val());
                base.Parameters.productIdSelected = productId;
                if (base.Control.slcTypePurchase().val() != 0 || base.Parameters.isWarehouse) {
                    base.Ajax.AjaxAddToOrder.data = {
                        quantity: quantity,
                        productId: productId,
                        process: 'Addition',
                        typePurchaseId: base.Control.slcTypePurchase().val(),
                        typePurchaseName: base.Control.slcTypePurchase().find('option:selected').text(),
                        isWarehouse: base.Parameters.isWarehouse
                    };
                    base.Ajax.AjaxAddToOrder.submit();
                }
                else {
                    base.Function.ShowToastrError("Por favor, seleccione el Tipo de Pedido");
                }
            });
        },
        GetProducts: function () {
            base.Ajax.AjaxGetProductsForOrder.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                productName: ''
            };
            base.Ajax.AjaxGetProductsForOrder.submit();
        },
        ListingProducts: function (productStore) {
            base.Control.productContainer().empty();
            var $productContainer = $('#product-container');
            productStore.forEach(function (product) {
                var productHtml = `
                    <div class="col-xl-3 col-xxl-3 col-lg-4 col-sm-6">
                        <div class="card">
                            <div class="card-body product-grid-card">
                                <div class="new-arrival-product">
                                    <div style="display: flex;justify-content: center; height: 250px;">
                                        <img class="img-fluid" src="https://api.soynexora.com/StaticFiles/ProductsImg/${product.imageName}" alt="">
                                    </div>
                                    <div class="new-arrival-content text-center mt-3">
                                        <h4><a>${product.productName}</a></h4>
                                        <span class="price colorPurplelLabelMitosiz">S/${product.price}</span>
                                        <div style="display: flex; justify-content: center;">
                                            <button value-hidden="${product.productId}" class="btn btn-primary backgroundPurpleButtonMitosiz sharp sharp-lg sub-number" style="color:white;margin-right: 0.0rem;">-</button>
                                            <input id="txtNumber${product.productId}" type="text" value="1" class="form-control input-number" style="margin-left: 0.7rem; margin-right: 0.7rem;text-align: center;" />
                                            <button value-hidden="${product.productId}" class="btn btn-primary backgroundPurpleButtonMitosiz sharp sharp-lg add-number" style="color:white;margin-right: 0.0rem;">+</button>
                                            <button value-hidden="${product.productId}" class="btn btn-primary backgroundYellowButtonMitosiz addToOrder" style="color:white;margin-left: 5px;"><i class="fa fa-shopping-basket"></i></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                $productContainer.append(productHtml);
            });
            base.Function.UpdatePagination();
        },
    };
}