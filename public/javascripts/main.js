jQuery(document).ready(function ($) {
    let FormSubmit = () => {
        $('.Delete').ajaxSubmit({
            success: (res) => {
                $(`#row-${res.id}`).remove();
                toastr.success(res.msg);
            },
            error: (res) => {
                toastr.error(res.msg);
            }

        });
    }
    FormSubmit();
    $(document).on('submit', '.Delete', function () {
        let DeleteConfirm = confirm("Are you sure you want to delete?");
        if (DeleteConfirm)
            FormSubmit();
        return false;
    });

    $(document).on('submit', '#NewDep', function () {
        $.ajax({
            url: '/departments/add',
            type: 'POST',
            data: $(this).serialize(),
            tryCount: 0,
            retryLimit: 5,
            success: function (res) {
                this.tryCount = 0;
                toastr.success(res.msg);
                let Button = `
                                          <form action="/departments/delete" method="post" class="Delete">
                                            <input type="text" name="departmentID" value="${res.id}" hidden>
                                            <button type="submit" class="btn  btn-danger">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </form>`
                let DepTable = $("#departmentsTable").DataTable()
                DepTable.row.add([res.id, res.Name, Button])
                DepTable.draw()
                $('#NewDepModal').modal('hide')
            },
            error: function (xhr, textStatus, errorThrown) {
                if (textStatus === 'timeout') {
                    this.tryCount++;
                    toastr.error("Error! " + xhr.status + " " + textStatus + ", Retrying");
                    if (this.tryCount <= this.retryLimit) {
                        //try again
                        $.ajax(this);
                        return;
                    }
                    return;
                }
                if (xhr.status === 500) {
                    toastr.error("Error! " + xhr.status + " " + textStatus);
                } else {
                    toastr.error("Error! " + xhr.status + " " + textStatus);
                }
            }
        });
        return false;
    });
    $(document).on('submit', '#NewDev', function () {
        $.ajax({
            url: '/devices/add',
            type: 'POST',
            data: $(this).serialize(),
            tryCount: 0,
            retryLimit: 5,
            success: function (res) {
                this.tryCount = 0;
                toastr.success(res.msg);
                let DeleteButton = `
                    <form action="/devices/delete" method="post" class="Delete">
                        <input type="text" name="deviceID" value="${res.id}" hidden>
                        <button type="submit" class="btn btn-danger">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </form>
                `
                let AlertButton = `<form action="/devices/alert" method="post">
                    <input type="text" name="deviceID" value="${res.id}" hidden>
                    <button type="submit" class="btn btn-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                    </button>
                </form>`
                let DepTable = $("#departmentsTable").DataTable()
                DepTable.row.add([res.Name, res.Manufacturer, res.Model, res.Serial, res.ImportDate, res.InstallationDate, res.ScrappingDate, res.SupplyingCompany, res.Department, res.PPMInterval, DeleteButton, AlertButton])
                DepTable.draw()
                $('#NewDevModal').modal('hide')
            },
            error: function (xhr, textStatus, errorThrown) {
                if (textStatus === 'timeout') {
                    this.tryCount++;
                    toastr.error("Error! " + xhr.status + " " + textStatus + ", Retrying");
                    if (this.tryCount <= this.retryLimit) {
                        //try again
                        $.ajax(this);
                        return;
                    }
                    return;
                }
                if (xhr.status === 500) {
                    toastr.error("Error! " + xhr.status + " " + textStatus);
                } else {
                    toastr.error("Error! " + xhr.status + " " + textStatus);
                }
            }
        });
        return false;
    });
    $("#departmentsTable").DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "responsive": true,
    });
    $("#devicesTable").DataTable({
        "paging": true,
        "lengthChange": true,
        "searching": true,
        "ordering": true,
        "info": true,
        "autoWidth": false,
        "responsive": true,
    });

})
