ns('Mitosiz.Site.Commission.Index')
Mitosiz.Site.Commission.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Function.GetLogin();
        base.Ajax.AjaxGetComissionPeriodForComission.submit();
        base.Function.clsNumberPagination();
        base.Control.btnFilter().click(base.Event.btnFilterClick);
        base.Control.btnCommission().click(base.Event.btnCommissionClick);
        base.Control.btnSave().click(base.Event.btnSaveClick);
    };
    base.Parameters = {
        currentPage: 1,
        totalPages: 1,
        sizePagination: 10,
        storeId: 0
    };
    base.Control = {
        slcPeriod: function () { return $('#slcPeriod'); },
        btnFilter: function () { return $('#btnFilter'); },
        tbodyTable: function () { return $('#tbodyCommission'); },
        divPagination: function () { return $('#pagination'); },
        divPaginationModal: function () { return $('#paginationModal'); },
        lblHistoricalCommission: function () { return $('#lblHistoricalCommission'); },
        lblCommissionCurrentPeriod: function () { return $('#lblCommissionCurrentPeriod'); },
        lblPendingCommission: function () { return $('#lblPendingCommission'); },
        btnCommission: function () { return $('#btnCommission'); },
        modalUpdate: function () { return $('#modalUpdate'); },
        btnSave: function () { return $('#btnSave'); },
        lblAmountAvailable: function () { return $('#lblAmountAvailable'); },
        lblRUC: function () { return $('#lblRUC'); },
        lblBank: function () { return $('#lblBank'); },
        lblAccountNumber: function () { return $('#lblAccountNumber'); },
        lblAccountNumberCCI: function () { return $('#lblAccountNumberCCI'); },
        lblHolderName: function () { return $('#lblHolderName'); },
        txtAmountToBeRequest: function () { return $('#txtAmountToBeRequest'); },
        txtConcept: function () { return $('#txtConcept'); },
        txtFile: function () { return $('#txtConcept'); },
    };
    base.Event = {
        AjaxGetLoginSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.storeId = data.data.storeId;
                    base.Function.GetMovementOfCommitteesWholesaleForUser();
                    base.Function.GetInformationWholesaleProfile();
                }
            }
        },
        AjaxGetComissionPeriodForComissionSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcPeriod().empty();
                    $.each(data.data, function (key, value) {
                        base.Control.slcPeriod().append($('<option>', {
                            value: value.commissionPeriodId,
                            text: value.periodName
                        }));
                    });
                    base.Control.slcPeriod().selectpicker('refresh');
                    base.Function.GetCommissionWholesaleByView();
                }
            }
        },
        AjaxGetMovementOfCommitteesWholesaleForUserlSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPages = data.data.totalPages;
                    base.Function.FillData(data.data.movementOfCommitteesWholesaleForUser);
                }
            }
        },
        AjaxGetInformationWholesaleProfileSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.lblRUC().text(data.data.ruc);
                    base.Control.lblBank().text(data.data.bank);
                    base.Control.lblAccountNumber().text(data.data.bankAccount);
                    base.Control.lblAccountNumberCCI().text(data.data.interbankAccount);
                    base.Control.lblHolderName().text(data.data.delegateName);
                }
            }
        },
        AjaxCommissionWholesaleByViewSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.lblHistoricalCommission().text(data.data.historyCommission);
                    base.Control.lblCommissionCurrentPeriod().text(data.data.currentCommission);
                    base.Control.lblPendingCommission().text(data.data.commissionToBeCollected);
                    base.Control.lblAmountAvailable().text(data.data.commissionToBeCollected);
                }
            }
        },
        btnFilterClick: function () {
            base.Function.GetCommissionWholesaleByView();
        },
        btnCommissionClick: function () {
            base.Control.modalUpdate().modal('show');
        },
        btnSaveClick: function () {
            var fileInput = $('#txtFile')[0].files[0];
            if (base.Control.txtAmountToBeRequest().val() == "0" || base.Control.txtAmountToBeRequest().val() == "") {
                Swal.fire("Oops...", "El monto solicitado es incorrecto", "error")
            }
            else if (base.Control.lblAmountAvailable().text() == "0" || base.Control.lblAmountAvailable().text() == "" ||
                    base.Control.lblAmountAvailable().text() < base.Control.txtAmountToBeRequest().val()) {
                Swal.fire("Oops...", "El monto solicitado es mayor a su comisión pendiente por cobrar", "error")
            }
            else if (base.Control.lblRUC().text() == "") {
                Swal.fire("Oops...", "Por favor, actualice su RUC en la sección 'Editar Datos'", "error")
            }
            else if (base.Control.lblAccountNumber().text() == "") {
                Swal.fire("Oops...", "Por favor, actualice su Número de cuenta en la sección 'Editar Datos'", "error")
            }
            else if (base.Control.lblAccountNumberCCI().text() == "") {
                Swal.fire("Oops...", "Por favor, actualice su Número de cuenta interbancarop en la sección 'Editar Datos'", "error")
            }
            else if (base.Control.lblBank().text() == "") {
                Swal.fire("Oops...", "Por favor, actualice su Banco en la sección 'Editar Datos'", "error")
            }
            else if (base.Control.txtConcept().val() == "") {
                Swal.fire("Oops...", "Por favor, ingrese un concepto válido", "error")
            }
            else if (!fileInput) {
                Swal.fire("Oops...", "Por favor, adjunto un archivo válido", "error")
            }
            else if ($("input[name='invoiceOption']:checked").length == 0) {
                Swal.fire("Oops...", "Por favor, seleccione una opción en 'SIN FACTURA'o 'CON FACTURA' ", "error")
            }
            else {
                var formData = new FormData();
                var textReceipt = $("#withInvoice").is(":checked") ? "Factura" : "Sin Factura";
                formData.append('file', fileInput);
                formData.append('fileName', "");
                formData.append('storeId', base.Parameters.storeId);
                formData.append('concept', base.Control.txtConcept().val());
                formData.append('receipt', textReceipt);
                formData.append('amount', base.Control.txtAmountToBeRequest().val());

                $.ajax({
                    url: Mitosiz.Site.Commission.Actions.SavePaymentDepositWholesale,
                    type: 'POST',
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (data) {
                        if (data) {
                            if (data.isSuccess) {
                                base.Control.txtFile().val('');
                                Swal.fire("Excelente !!", "La solicitud ha sido enviada !!", "success")
                                base.Control.modalUpdate().modal('hide');
                                base.Function.GetLogin();
                                base.Ajax.AjaxGetComissionPeriodForComission.submit();
                            }
                            else {
                                Swal.fire("Oops...", "Ocurrió un error, Por favor intententelo nuevamente", "error")
                            }
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.error('Upload failed:', textStatus, errorThrown);
                    }
                });
            }
        },
    };
    base.Ajax = {
        AjaxGetLogin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Commission.Actions.GetLogin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetLoginSuccess
        }),
        AjaxGetComissionPeriodForComission: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Commission.Actions.GetComissionPeriodForComission,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetComissionPeriodForComissionSuccess
        }),
        AjaxGetMovementOfCommitteesWholesaleForUser: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Commission.Actions.GetMovementOfCommitteesWholesaleForUser,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetMovementOfCommitteesWholesaleForUserlSuccess
        }),
        AjaxCommissionWholesaleByView: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Commission.Actions.CommissionWholesaleByView,
            autoSubmit: false,
            onSuccess: base.Event.AjaxCommissionWholesaleByViewSuccess
        }),
        AjaxGetInformationWholesaleProfile: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Commission.Actions.GetInformationWholesaleProfile,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetInformationWholesaleProfileSuccess
        }),
    };
    base.Function = {
        GetLogin: function () {
            base.Ajax.AjaxGetLogin.submit();
        },
        GetMovementOfCommitteesWholesaleForUser: function () {
            base.Ajax.AjaxGetMovementOfCommitteesWholesaleForUser.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                storeId: base.Parameters.storeId
            };
            base.Ajax.AjaxGetMovementOfCommitteesWholesaleForUser.submit();
        },
        GetInformationWholesaleProfile: function () {
            base.Ajax.AjaxGetInformationWholesaleProfile.data = {
                storeId: base.Parameters.storeId
            };
            base.Ajax.AjaxGetInformationWholesaleProfile.submit();
        },
        GetCommissionWholesaleByView: function () {
            base.Ajax.AjaxCommissionWholesaleByView.data = {
                storeId: base.Parameters.storeId,
                commissionPeriodId: base.Control.slcPeriod().val()
            };
            base.Ajax.AjaxCommissionWholesaleByView.submit();
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
                base.Function.GetMovementOfCommitteesWholesaleForUser();
            });
        },
        FillData: function (listData) {
            base.Control.tbodyTable().empty();
            listData.forEach(function (data) {
                var urlFile = 'https://api.soynexora.com/StaticFiles/MovementOfCommitteesWholesale/' + data.fileName;
                var styleFile = data.fileName == '' ? "display:none;" : "";
                base.Control.tbodyTable().append('<tr style="text-align: center;">' +
                    '<td>' + data.typeOfMovement + '</td>' +
                    '<td>' + data.concept + '</td>' +
                    '<td>' + data.creationTime + '</td>' +
                    '<td>' + data.receipt + '</td>' +
                    '<td>' +
                    '<div style="' + styleFile + '">' +
                    '<a href = "' + urlFile + '" target="_blank">' +
                    data.fileName +
                    '</a>' +
                    '</div></td>' +
                    '<td>' + data.amount + '</td>' +
                    '<td>' + data.status + '</td>' +
                    '<td>' + data.observation + '</td>' +
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
    };
}