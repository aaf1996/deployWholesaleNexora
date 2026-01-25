ns('Mitosiz.Site.Information.Index')
Mitosiz.Site.Information.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Function.GetLogin();
        base.Control.btnSave().click(base.Event.btnSaveClick);
    };
    base.Parameters = {
        storeId: 0,
    };
    base.Control = {
        txtDelegateName: function () { return $('#txtDelegateName'); },
        txtAddress: function () { return $('#txtAddress'); },
        txtPhone: function () { return $('#txtPhone'); },
        txtMail: function () { return $('#txtMail'); },
        txtRuc: function () { return $('#txtRuc'); },
        slcBank: function () { return $('#slcBank'); },
        txtBankAccount: function () { return $('#txtBankAccount'); },
        txtInterbankAccount: function () { return $('#txtInterbankAccount'); },
        btnSave: function () { return $('#btnSave'); },
    };
    base.Event = {
        AjaxGetLoginSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.storeId = data.data.storeId;
                    base.Function.GetInformationWholesale();
                }
            }
        },
        AjaxUpdateInformationWholesaleProfileSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    Swal.fire("Excelente !!", "Datos actualizados !!", "success")
                }
                else {
                    Swal.fire("Oops...", "Ocurrió un error, Por favor intententelo nuevamente", "error")
                }
            }
        },
        AjaxGetInformationWholesaleProfileSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.txtDelegateName().val(data.data.delegateName);
                    base.Control.txtAddress().val(data.data.address);
                    base.Control.txtPhone().val(data.data.phone);
                    base.Control.txtMail().val(data.data.mail);
                    base.Control.txtRuc().val(data.data.ruc);
                    base.Control.txtBankAccount().val(data.data.bankAccount);
                    base.Control.txtInterbankAccount().val(data.data.interbankAccount);
                    if (data.data.bank == null) {
                        base.Control.slcBank().prop('selectedIndex', 0);
                    } else {
                        base.Control.slcBank().val(data.data.bank);
                    }
                    base.Control.slcBank().selectpicker('refresh');
                }
            }
        },
        btnSaveClick: function () {
            base.Ajax.AjaxUpdateInformationWholesaleProfile.data = {
                storeId: base.Parameters.storeId,
                address: base.Control.txtAddress().val(),
                phone: base.Control.txtPhone().val(),
                mail: base.Control.txtMail().val(),
                delegateName: base.Control.txtDelegateName().val(),
                ruc: base.Control.txtRuc().val(),
                bank: base.Control.slcBank().val(),
                bankAccount: base.Control.txtBankAccount().val(),
                interbankAccount: base.Control.txtInterbankAccount().val(),
            };
            base.Ajax.AjaxUpdateInformationWholesaleProfile.submit();
        },
    };
    base.Ajax = {
        AjaxGetLogin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Information.Actions.GetLogin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetLoginSuccess
        }),
        AjaxGetInformationWholesaleProfile: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Information.Actions.GetInformationWholesaleProfile,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetInformationWholesaleProfileSuccess
        }),
        AjaxUpdateInformationWholesaleProfile: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.Information.Actions.UpdateInformationWholesaleProfile,
            autoSubmit: false,
            onSuccess: base.Event.AjaxUpdateInformationWholesaleProfileSuccess
        }),
    };
    base.Function = {
        GetLogin: function () {
            base.Ajax.AjaxGetLogin.submit();
        },
        GetInformationWholesale: function () {
            base.Ajax.AjaxGetInformationWholesaleProfile.data = {
                storeId: base.Parameters.storeId
            };
            base.Ajax.AjaxGetInformationWholesaleProfile.submit();
        },
    };
}