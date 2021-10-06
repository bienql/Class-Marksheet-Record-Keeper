var ordernumber = 0;

$(document).ready(function() {
    $("#myForm").on("click", "#enter", function() {
        //MAIN function after clicking 'NHẬP'
    
        var name = $("#fieldname").val();
        var maths = $("#fieldmaths").val();
        var physics = $("#fieldphysics").val();
        var chemistry = $("#fieldchemistry").val();
    
        //validation            
        if (name == "" || maths == "" || physics == "" || chemistry == "") {
            alert("Xin hãy điền đầy đủ thông tin!");
            return false;
        }
    
        if (isNaN(maths) || isNaN(physics) || isNaN(chemistry)) {
            alert("Điểm số phải là chữ số!");
            return false;
        }
    
        if ((maths < 0 || maths > 10) || (physics  < 0 || physics > 10) || (chemistry < 0 || chemistry > 10)) {
            alert("Điểm số phải nằm trong khoảng (0 - 10)!");
            return false;
        }
    
        //add row and cells
        ordernumber++;
        var row = $("<tr class='rowdata' />");
        row.append($("<td class='center middle'>" + ordernumber + "</td>"));
        row.append($("<td class='padleft middle'>" + name + "<span class='editblock'><i class='edit fa fa-pencil'></i><i class='delete fa fa-close'></i></span></td>"));
        row.append($("<td class='center middle maths'>" + maths + "</td>"));
        row.append($("<td class='center middle physics'>" + physics + "</td>"));
        row.append($("<td class='center middle chemistry'>" + chemistry + "</td>"));
        row.append($("<td class='center middle avg'>?</td>"));
        $("#myTable").find("thead").append(row);
    
        $("#myForm")[0].reset(""); //clear input            
    });
});

// calculateAverage
$(document).on("click", "#cal", function() {          
    //loop through column average        
    $("#myTable > thead > .rowdata").each(function() {
        var maths = parseFloat($(this).find("td").eq(2).text());
        var physics = parseFloat($(this).find("td").eq(3).text());
        var chemistry = parseFloat($(this).find("td").eq(4).text());
        var average = ((maths + physics + chemistry) / 3).toFixed(1);
        $(this).find("td").eq(5).text(average);
    });
    
});

// checkDistinction
$(document).on("click", "#check", function() {    
    $("#myTable > thead > .rowdata").each(function() {
        if(parseFloat($(this).find("td").eq(5).text()) >= 8) {
            $(this).addClass("turnred");
        }
        else {
            $(this).removeClass("turnred");
        }
    });
});

// DELETE row function
$(document).on("click", ".delete", function() {
    var confirm = window.confirm("Bạn chắc chắn muốn xóa chứ?");
    if(confirm) {
        $(this).closest(".rowdata").remove();
        ordernumber--;
        var ordernumber_new = 1;
        $("#myTable > thead > .rowdata").each(function() {        
            $(this).find('td').eq(0).text(ordernumber_new++);
        });
    }    
});

//click header to sort
$(document).on("click", "#namecol", function() {sortTable(1, 'text');});
$(document).on("click", "#mathscol", function() {sortTable(2, 'number');});
$(document).on("click", "#physicscol", function() {sortTable(3, 'number');});
$(document).on("click", "#chemistrycol", function() {sortTable(4, 'number');});
$(document).on("click", "#avgcol", function() {sortTable(5, 'number');});

function sortTable(column, type) {
    //store column data to 'order
    var order = $('.table thead tr>th:eq(' + column + ')').data('order');
    order = order === 'ASC' ? 'DESC' : 'ASC'; //toggle ascending vs descending upon click
    $('.table thead tr>th:eq(' + column + ')').data('order', order);

    //Sort the table
    $(".table .rowdata").sort(function(a, b) {
        a = $(a).find('td:eq(' + column + ')').text();
        b = $(b).find('td:eq(' + column + ')').text();
        switch (type) {
            case 'text':           
                return order === 'ASC' ? a.localeCompare(b) : b.localeCompare(a);                        
            case 'number':           
                return order === 'ASC' ? parseFloat(a) - parseFloat(b) : parseFloat(b) - parseFloat(a);                  
        }
    }).appendTo(".table thead"); //add back after the first row
    
    //reiterate the first column
    var ordernumber_new = 1;
    $("#myTable > thead > .rowdata").each(function() {        
        $(this).find('td').eq(0).text(ordernumber_new++);
    });
}

// EDIT mode
$(document).on("click", ".edit", function() {
    var name_data = $(this).closest(".rowdata").find("td").eq(1).text();
    var maths_data = $(this).closest(".rowdata").find("td").eq(2).text();
    var physics_data = $(this).closest(".rowdata").find("td").eq(3).text();
    var chemistry_data = $(this).closest(".rowdata").find("td").eq(4).text();

    //disable buttons and clickable
    $(document).find("button").prop("disabled", true);
    $(document).find(".edit").hide();
    $(document).find(".delete").hide();

    $(this).closest(".rowdata").find("td").eq(2).html("<input id='mathstext' class='form-control' type='text' value='"+maths_data+"'>");
    
    $(this).closest(".rowdata").find("td").eq(3).html("<input id='physicstext' class='form-control' type='text' value='"+physics_data+"'>");

    $(this).closest(".rowdata").find("td").eq(4).html("<input id='chemistrytext' class='form-control' type='text' value='"+chemistry_data+"'>");

    $(this).closest(".rowdata").find("td").eq(1).html("<div class='inner-addon right-addon'><input id='nametext' class='form-control' type='text' value='"+name_data+"'><i id='abort' class='fa fa-ban'></i><i id='save' class='fa fa-check'></i></div>");

    $(document).on("click", "#abort", function() {
        $(this).closest(".rowdata").find("td").eq(2).text(maths_data);
        $(this).closest(".rowdata").find("td").eq(3).text(physics_data);
        $(this).closest(".rowdata").find("td").eq(4).text(chemistry_data);
        $(this).closest(".rowdata").find("td").eq(1).html(name_data + "<span class='editblock'><i class='edit fa fa-pencil'></i><i class='delete fa fa-close'></i></span>");

        //enable buttons and clickable
        $(document).find("button").prop("disabled", false);
        $(document).find(".edit").show();
        $(document).find(".delete").show();
        $("#myTable").find("input").remove();
        $("#myTable").find("#abort").remove();
        $("#myTable").find("#save").remove();
    });

});

// SAVE function
$(document).on("click", "#save", function() {
    var name = $("#nametext").val();
    var maths = $("#mathstext").val();
    var physics = $("#physicstext").val();
    var chemistry = $("#chemistrytext").val();

    //re - validation            
    if (name == "" || maths == "" || physics == "" || chemistry == "") {
        alert("Xin hãy điền đầy đủ thông tin!");
        return false;
    }

    if (isNaN(maths) || isNaN(physics) || isNaN(chemistry)) {
        alert("Điểm số phải là chữ số!");
        return false;
    }

    if ((maths < 0 || maths > 10) || (physics  < 0 || physics > 10) || (chemistry < 0 || chemistry > 10)) {
        alert("Điểm số phải nằm trong khoảng (0 - 10)!");
        return false;
    }
    
    $(this).closest(".rowdata").find("td").eq(2).text(maths);
    $(this).closest(".rowdata").find("td").eq(3).text(physics);
    $(this).closest(".rowdata").find("td").eq(4).text(chemistry);
    $(this).closest(".rowdata").find("td").eq(1).html(name + "<span class='editblock'><i class='edit fa fa-pencil'></i><i class='delete fa fa-close'></i></span>");

    //enable buttons and clickable
    $(document).find("button").prop("disabled", false);
    $(document).find(".edit").show();
    $(document).find(".delete").show();
    $("#myTable").find("input").remove();
    $("#myTable").find("#abort").remove();
    $("#myTable").find("#save").remove();

});

//KEYPRESS in EDIT mode
$(document).keyup(function(e) {
    if (e.which == 13) $("#save").click();    // enter
    if (e.which == 27) $("#abort").click();   // esc
  });
