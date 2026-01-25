ns('Mitosiz.Site.User.Index')
Mitosiz.Site.User.Index.Controller = function () {
    var base = this;
    base.Initialize = function () {
        base.Function.GetUsersAdmin();
        base.Function.clsNumberPagination();
        base.Function.clsUpdateDataClick();
        base.Function.clsDeleteDataClick();
        base.Control.btnSearch().click(base.Event.btnSearchClick);
        base.Control.slcDepartment().change(base.Event.slcDepartmentChange);
        base.Control.slcProvince().change(base.Event.slcProvinceChange);
        base.Control.btnUpdateModal().click(base.Event.btnUpdateModalClick);
        base.Ajax.AjaxGetDepartmentForAdmin.submit();
        base.Ajax.AjaxGetStoresAdmin.submit();
        base.Ajax.AjaxGetPackageDropDownForAdmin.submit();
        base.Control.txtPatron().autocomplete({
            source: function (request, response) {
                $.ajax({
                    type: 'POST',
                    url: Mitosiz.Site.User.Actions.GetDropDownPatrons,
                    contentType: 'application/json',
                    data: JSON.stringify({
                        NamePatron: request.term 
                    }),
                    async: false,
                    success: function (data) {
                        var results = $.map(data.data, function (tag) {
                            return {
                                label: tag.namePatron,
                                value: tag.userId
                            };
                        });
                        response(results);
                    },
                    error: function (jqXHR, t, exception) {
                        console.log("Error");
                    }
                });
            },
            minLength: 0,
            maxResults: 6,
            select: function (event, ui) {
                base.Control.hiddenPatron().val(ui.item.value);
                base.Control.txtPatron().val(ui.item.label);
                return false;
            }
        });
    };
    base.Parameters = {
        currentPage: 1,
        totalPages: 1,
        sizePagination: 10,
        slcProvinceId: 0,
        slcDistrictId: 0,
        dontSetValueDropDown: false
    };
    base.Control = {
        divPagination: function () { return $('#pagination'); },
        tbodyUser: function () { return $('#tbodyUser'); },
        txtUserId: function () { return $('#txtUserId'); },
        txtDocument: function () { return $('#txtDocument'); },
        txtNames: function () { return $('#txtNames'); },
        btnSearch: function () { return $('#btnSearch'); },
        modalUpdate: function () { return $('#modalUpdate'); },
        slcCountry: function () { return $('#slcCountry'); },
        slcDepartment: function () { return $('#slcDepartment'); },
        slcProvince: function () { return $('#slcProvince'); },
        slcDistrict: function () { return $('#slcDistrict'); },
        txtUserIdModal: function () { return $('#txtUserIdModal'); },
        slcTypeDocument: function () { return $('#slcTypeDocument'); },
        txtDocumentModal: function () { return $('#txtDocumentModal'); },
        txtNamesModal: function () { return $('#txtNamesModal'); },
        txtLastName: function () { return $('#txtLastName'); },
        txtUserName: function () { return $('#txtUserName'); },
        txtPassword: function () { return $('#txtPassword'); },
        txtMail: function () { return $('#txtMail'); },
        txtAddress: function () { return $('#txtAddress'); },
        txtPhone: function () { return $('#txtPhone'); },
        txtUbigeo: function () { return $('#txtUbigeo'); },
        slcStatus: function () { return $('#slcStatus'); },
        txtBirthDate: function () { return $('#txtBirthDate'); },
        txtRecognitionName: function () { return $('#txtRecognitionName'); },
        txtPatron: function () { return $('#txtPatron'); },
        hiddenPatron: function () { return $('#hiddenPatron'); },
        slcStoreId: function () { return $('#slcStoreId'); },
        slcPackageId: function () { return $('#slcPackageId'); },
        btnUpdateModal: function () { return $('#btnUpdateModal'); },
    };
    base.Event = {
        AjaxGetUsersAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Parameters.totalPages = data.data.totalPages;
                    base.Function.FillDataUser(data.data.usersForAdmin);
                }
            }
        },
        AjaxGetDepartmentForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcDepartment().empty();
                    $.each(data.data, function (key, value) {
                        base.Control.slcDepartment().append($('<option>', {
                            value: value.departmentId,
                            text: value.description
                        }));
                    });
                    base.Control.slcDepartment().selectpicker('refresh');
                }
            }
        },
        AjaxGetProvinceForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcProvince().empty();
                    $.each(data.data, function (key, value) {
                        base.Control.slcProvince().append($('<option>', {
                            value: value.provinceId,
                            text: value.description
                        }));
                    });
                    if (!base.Parameters.dontSetValueDropDown) {
                        base.Control.slcProvince().val(base.Parameters.slcProvinceId);
                    }
                    base.Control.slcProvince().selectpicker('refresh');
                    base.Parameters.dontSetValueDropDown = false;
                }
            }
        },
        AjaxGetDistrictForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcDistrict().empty();
                    $.each(data.data, function (key, value) {
                        base.Control.slcDistrict().append($('<option>', {
                            value: value.districtId,
                            text: value.description
                        }));
                    });
                    if (!base.Parameters.dontSetValueDropDown) {
                        base.Control.slcDistrict().val(base.Parameters.slcDistrictId);
                    }
                    base.Control.slcDistrict().selectpicker('refresh');
                }
            }
        },
        AjaxGetStoresAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcStoreId().empty();
                    $.each(data.data, function (key, value) {
                        base.Control.slcStoreId().append($('<option>', {
                            value: value.storeId,
                            text: value.storeName
                        }));
                    });
                    base.Control.slcStoreId().selectpicker('refresh');
                }
            }
        },
        AjaxGetPackageDropDownForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Control.slcPackageId().empty();
                    $.each(data.data, function (key, value) {
                        base.Control.slcPackageId().append($('<option>', {
                            value: value.packageId,
                            text: value.namePackage
                        }));
                    });
                    base.Control.slcPackageId().selectpicker('refresh');
                }
            }
        },
        AjaxGetUserDetailForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    base.Function.FillDataIntoModal(data.data);
                    base.Control.modalUpdate().modal('show');
                }
            }
        },
        AjaxUpdateUserForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    Swal.fire("Excelente !!", "Usuario actualizado !!", "success")
                    base.Control.modalUpdate().modal('hide');
                    base.Function.GetUsersAdmin();
                }
                else {
                    Swal.fire("Oops...", "Ocurrió un error, Por favor intententelo nuevamente", "error")
                }
            }
        },
        AjaxDeleteUserForAdminSuccess: function (data) {
            if (data) {
                if (data.isSuccess) {
                    Swal.fire("Excelente !!", "El Usuario fue eliminado !!", "success")
                    base.Function.GetUsersAdmin();
                }
                else {
                    Swal.fire("Oops...", "Ocurrió un error, Por favor intententelo nuevamente", "error")
                    base.Function.GetUsersAdmin();
                }
            }
        },
        btnSearchClick: function () {
            var userId = (base.Control.txtUserId().val() == "") ? 0 : parseInt(base.Control.txtUserId().val());
            base.Parameters.currentPage = 1;
            base.Ajax.AjaxGetUsersAdmin.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                userId: userId,
                document: base.Control.txtDocument().val(),
                names: base.Control.txtNames().val()
            };
            base.Ajax.AjaxGetUsersAdmin.submit();
        },
        btnUpdateModalClick: function () {
            var patronId = base.Control.hiddenPatron().val() == "" || base.Control.txtPatron().val() == "" ? null : base.Control.hiddenPatron().val();
            base.Ajax.AjaxUpdateUserForAdmin.data = {
                userId: base.Control.txtUserIdModal().val(),
                typeDocument: base.Control.slcTypeDocument().val(),
                document: base.Control.txtDocumentModal().val(),
                names: base.Control.txtNamesModal().val(),
                lastName: base.Control.txtLastName().val(),
                userName: base.Control.txtUserName().val(),
                password: base.Control.txtPassword().val(),
                mail: base.Control.txtMail().val(),
                address: base.Control.txtAddress().val(),
                countryId: base.Control.slcCountry().val(),
                departmentId: base.Control.slcDepartment().val(),
                provinceId: base.Control.slcProvince().val(),
                districtId: base.Control.slcDistrict().val(),
                phone: base.Control.txtPhone().val(),
                ubigeo: base.Control.txtUbigeo().val(),
                accountStatus: base.Control.slcStatus().val(),
                birthDate: base.Control.txtBirthDate().val(),
                recognitionName: base.Control.txtRecognitionName().val(),
                storeId: base.Control.slcStoreId().val(),
                packageId: base.Control.slcPackageId().val(),
                patronId: patronId
            };
            base.Ajax.AjaxUpdateUserForAdmin.submit();
        },
        slcDepartmentChange: function () {
            var departmentId = base.Control.slcDepartment().val();
            base.Parameters.dontSetValueDropDown = true;
            base.Ajax.AjaxGetProvinceForAdmin.data = {
                locationId: departmentId
            };
            base.Ajax.AjaxGetProvinceForAdmin.submit();
        },
        slcProvinceChange: function () {
            var provinceId = base.Control.slcProvince().val();
            base.Parameters.dontSetValueDropDown = true;
            base.Ajax.AjaxGetDistrictForAdmin.data = {
                locationId: provinceId
            };
            base.Ajax.AjaxGetDistrictForAdmin.submit();
        },
    };
    base.Ajax = {
        AjaxGetUsersAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.User.Actions.GetDataUser,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetUsersAdminSuccess
        }),
        AjaxGetUserDetailForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.User.Actions.GetUserDetailForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetUserDetailForAdminSuccess
        }),
        AjaxUpdateUserForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.User.Actions.UpdateUserForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxUpdateUserForAdminSuccess
        }),
        AjaxGetDepartmentForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.User.Actions.GetDepartmentForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetDepartmentForAdminSuccess
        }),
        AjaxGetProvinceForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.User.Actions.GetProvinceForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetProvinceForAdminSuccess
        }),
        AjaxGetDistrictForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.User.Actions.GetDistrictForAdmin,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetDistrictForAdminSuccess
        }),
        AjaxGetStoresAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.User.Actions.GetStores,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetStoresAdminSuccess
        }),
        AjaxGetPackageDropDownForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.User.Actions.GetPackageDropDown,
            autoSubmit: false,
            onSuccess: base.Event.AjaxGetPackageDropDownForAdminSuccess
        }),
        AjaxDeleteUserForAdmin: new Mitosiz.Site.UI.Web.Components.Ajax({
            action: Mitosiz.Site.User.Actions.DeleteUser,
            autoSubmit: false,
            onSuccess: base.Event.AjaxDeleteUserForAdminSuccess
        }),
    };
    base.Function = {
        UpdatePagination: function () {
            base.Control.divPagination().empty();
            base.Control.divPagination().append('<li class="page-item page-indicator"><a class="page-link" href="#" id="prev">«</a></li>');

            if (base.Parameters.totalPages <= 5) {
                for (var i = 1; i <= base.Parameters.totalPages; i++) {
                    base.Control.divPagination().append('<li class="page-item ' + (i === base.Parameters.currentPage ? 'active' : '') + '"><a class="page-link" href="#">' + i + '</a></li>');
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
                        var valueHidden = startPage -1;
                        base.Control.divPagination().append('<li class="page-item page-indicator"><a value-hidden="'+valueHidden+'" class="page-link" href="#">..</a></li>');
                    }
                }

                for (var i = startPage; i <= endPage; i++) {
                    base.Control.divPagination().append('<li class="page-item ' + (i === base.Parameters.currentPage ? 'active' : '') + '"><a class="page-link" href="#">' + i + '</a></li>');
                }

                if (endPage < base.Parameters.totalPages) {
                    if (endPage < base.Parameters.totalPages - 1) {
                        var valueHidden = endPage + 1;
                        base.Control.divPagination().append('<li class="page-item page-indicator"><a value-hidden="' + valueHidden +'" class="page-link" href="#">..</a></li>');
                    }
                    base.Control.divPagination().append('<li class="page-item"><a class="page-link" href="#">' + base.Parameters.totalPages + '</a></li>');
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
                base.Function.GetUsersAdmin();
            });
        },
        GetUsersAdmin: function () {
            var userId = (base.Control.txtUserId().val() == "") ? 0 : parseInt(base.Control.txtUserId().val());
            base.Ajax.AjaxGetUsersAdmin.data = {
                number: base.Parameters.currentPage,
                size: base.Parameters.sizePagination,
                userId: userId,
                document: base.Control.txtDocument().val(),
                names: base.Control.txtNames().val()
            };
            base.Ajax.AjaxGetUsersAdmin.submit();
        },
        FillDataUser: function (dataUsers) {
            base.Control.tbodyUser().empty();
            dataUsers.forEach(function (user) {
                base.Control.tbodyUser().append('<tr style="text-align: center;">' +
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
                    '<a class="dropdown-item updateData" value="' + user.userId + '" href="#">Actualizar</a>' +
                    '<a class="dropdown-item deleteData" value="' + user.userId + '" href="#">Eliminar</a>' +
                    '</div>' +
                    '</div></td>' +
                    '<td><strong>' + user.userId+'</strong></td>' +
                    '<td>' + user.names +'</td>' +
                    '<td>' + user.lastName +'</td>' +
                    '<td>' + user.recognitionName +'</td>' +
                    '<td>' + user.typeDocument +'</td>' +
                    '<td>' + user.document +'</td>' +
                    '<td>' + user.phone +'</td>' +
                    '<td>' + user.maximumRange +'</td>' +
                    '<td>' + user.patronName +'</td>' +
                    '<td>' + user.patronPhone +'</td>' +
                    '<td>' + user.package +'</td>' +
                    '<td>' + user.packageAmount +'</td>' +
                    '<td>' + user.creationDate +'</td>' +
                    '<td>' + user.creationTime +'</td>' +
                    '<td>' + user.affiliationDate +'</td>' +
                    '<td>' + user.affiliationTime +'</td>' +
                    '<td>' + user.preferentialWholesaler +'</td>' +
                    '<td>' + user.mail +'</td>' +
                    '<td>' + user.birthDate +'</td>' +
                    '<td>' + user.department +'</td>' +
                    '<td>' + user.province +'</td>' +
                    '<td>' + user.district +'</td>' +
                    '</tr>');
            });
            base.Function.UpdatePagination();
        },
        clsUpdateDataClick: function () {
            var parentElement = $(document);
            parentElement.on('click', '.updateData', function () {
                var userId = $(this).attr('value');
                base.Function.FillDataUserIntoModal(userId);
            });
        },
        clsDeleteDataClick: function () {
            var parentElement = $(document);
            parentElement.on('click', '.deleteData', function () {
                var userId = $(this).attr('value');
                Swal.fire({
                    title: "Estás segur@ de eliminar el usuario?",
                    text: "Esto no se puede revertir!",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Si, eliminar!"
                }).then((result) => {
                    if (result.isConfirmed) {
                        base.Ajax.AjaxDeleteUserForAdmin.data = {
                            userId: userId
                        };
                        base.Ajax.AjaxDeleteUserForAdmin.submit();
                    }
                });
            });
        },
        FillDataUserIntoModal: function (userId) {
            base.Ajax.AjaxGetUserDetailForAdmin.data = {
                userId: userId
            };
            base.Ajax.AjaxGetUserDetailForAdmin.submit();
        },
        FillDataIntoModal: function (data) {
            base.Control.slcDepartment().val(data.departmentId);
            base.Control.slcDepartment().selectpicker('refresh');
            base.Parameters.slcProvinceId = data.provinceId;
            base.Parameters.slcDistrictId = data.districtId;
            base.Ajax.AjaxGetProvinceForAdmin.data = {
                locationId: data.departmentId
            };
            base.Ajax.AjaxGetProvinceForAdmin.submit();
            base.Ajax.AjaxGetDistrictForAdmin.data = {
                locationId: data.provinceId
            };
            base.Ajax.AjaxGetDistrictForAdmin.submit();

            base.Control.slcStoreId().val(data.storeId);
            base.Control.slcStoreId().selectpicker('refresh');
            base.Control.slcPackageId().val(data.packageId);
            base.Control.slcPackageId().selectpicker('refresh');
            var dateString = data.birthDate.split(' ')[0];
            base.Control.txtUserIdModal().val(data.userId);
            base.Control.slcTypeDocument().val(data.typeDocument);
            base.Control.slcTypeDocument().selectpicker('refresh');
            base.Control.txtDocumentModal().val(data.document);
            base.Control.txtNamesModal().val(data.names);
            base.Control.txtLastName().val(data.lastName);
            base.Control.txtUserName().val(data.userName);
            base.Control.txtMail().val(data.mail);
            base.Control.txtAddress().val(data.address);
            base.Control.txtPhone().val(data.phone);
            base.Control.txtUbigeo().val(data.ubigeo);
            base.Control.txtPatron().val(data.namePatron);
            base.Control.slcStatus().val(data.accountStatus);
            base.Control.slcStatus().selectpicker('refresh');
            base.Control.txtBirthDate().datepicker({
                autoclose: true
            }).datepicker("setDate", dateString);
            base.Control.txtBirthDate().val(dateString);
            base.Control.txtRecognitionName().val(data.recognitionName);
            base.Control.slcStoreId().val(data.storeId);
            base.Control.slcPackageId().val(data.packageId);
            base.Control.hiddenPatron().val(data.patronId);
        },
    };
}