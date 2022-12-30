const api_url = "http://private-32dcc-products72.apiary-mock.com/product";
async function getapi(url) {
    const response = await fetch(url);
    var date = await response.json();
    show(date);
}

getapi(api_url);
var local;
var total = 0;

fx.base = "USD";
fx.rates = {
    "EUR": 0.745101,
    "GBP": 0.647710,
    "HKD": 7.781919,
    "USD": 1,
}

function show(data) {
    let tab = "";
    local = data;
    $.each(data, function (item) {

        if (data[item].description === undefined) { data[item].description = "description unavailable"; }

        tab += "<tr id=\"" + item + "\"><td>" + data[item].name + "</td><td> <a href=\"#\" data-toggle=\"tooltip\" title=\"" + data[item].description + "\"><span class=\"glyphicon glyphicon-info-sign\"aria-hidden=\"true\"></span></a></td><td>Price: <span class=\"price\" name=\"moneyX\" currency=\"USD\" > $" + data[item].price + "</span></td><td><button onclick=\"addToCart(" + item + ")\" class=\"btn btn-success\"  >Add to cart</button></td></tr >";
    });

    $('#produse').append(tab);
    $('[data-toggle="tooltip"]').tooltip();

    /*data.sort(function (a, b) {
        return b.price - a.price;
    });*/
}

function addToCart(item) {

    let currency_new = document.getElementsByName("moneyX")[item].getAttribute("currency");
    let currency_var = "$";
    if (currency_new == "EUR") {
        currency_var = "€";
    }

    $('table#produse tr#' + item).remove();
    row = "<tr name=\"shopping_c_rows\" id=\"" + item + "\"><td>" + local[item].name + "</td><td><input type=\"number\" id=\"" + item + "\" name=\"quantity\" min=\"1\" max=\"5\"value=1 data=\"1\" onChange=\"updateTotal(" + item + ",this)\"></td><td> <span class=\"price\" name=\"moneyX\" currency=\"" + currency_new + "\" >" + currency_var + local[item].price + "</span></td><td><button onclick=\"remove(" + item + ")\" class=\"btn btn-info\"  >Remove</button></td></tr>"

    $('#shopping_c').append(row);

    addItemToTotal(item);
}

function remove(item) {

    removeItemFromTotal(item);

    let currency_new = document.getElementsByName("moneyX")[item].getAttribute("currency");
    let currency_var = "$";
    if (currency_new == "EUR") {
        currency_var = "€";
    }

    $('table#shopping_c tr#' + item).remove();
    row = "<tr id=\"" + item + "\"><td>" + local[item].name + "</td><td> <a href=\"#\" data-toggle=\"tooltip\" title=\"" + local[item].description + "\"><span class=\"glyphicon glyphicon-info-sign\"aria-hidden=\"true\"></span></a></td>\></span></a></td><td> Price:<span class=\"price\" name=\"moneyX\" currency=\"" + currency_new + "\" >" + currency_var + local[item].price + "</span></td><td><button onclick=\"addToCart(" + item + ")\" class=\"btn btn-success\"  >Add to cart</button></td></tr >";

    $('#produse').append(row);

}

function clearCart() {
    $('table#shopping_c tbody tr').remove();
    $('table#produse tr').remove();
    show(local);
}

function addItemToTotal(item) {

    let elements = document.getElementsByName("quantity");

    for (i in elements) {
        if (elements[i].id == item) {
            total += elements[i].value * local[item].price;
            //console.log(parseFloat(total).toFixed(2));
            document.getElementById("total").value = parseFloat(total).toFixed(2);
        }
    }

}

function removeItemFromTotal(item) {

    let elements = document.getElementsByName("quantity");

    for (i in elements) {
        if (elements[i].id == item) {
            total = total - elements[i].value * local[item].price;
            document.getElementById("total").value = parseFloat(total).toFixed(2);
        }
    }
}

function updateTotal(item, obj) {

    let old_val = obj.getAttribute("data");
    let new_val = obj.value;
    total += (new_val - old_val) * local[item].price;
    document.getElementById("total").value = parseFloat(total).toFixed(2);
    obj.setAttribute("data", obj.value);
}

function toEUR() {
    var elems = document.getElementsByName("moneyX");
    for (i in elems) {
        if (elems[i].textContent !== undefined) {
            let text = elems[i].textContent;
            let currency_old = elems[i].getAttribute("currency");
            let string = text + " " + currency_old;
            let x = parseFloat(fx(string).to("EUR")).toFixed(2);
            elems[i].textContent = "€" + x;
            elems[i].setAttribute("currency", "EUR");
        }
    }

    for (i in local) {
        let string = "$" + local[i].price + " USD ";
        local[i].price = parseFloat(fx(string).to("EUR")).toFixed(2);
    }
}

function toGBP() {
    var elems = document.getElementsByName("moneyX");
    for (i in elems) {
        if (elems[i].textContent !== undefined) {
            let text = elems[i].textContent;
            let currency_old = elems[i].getAttribute("currency");
            let string = text + " " + currency_old;
            let x = parseFloat(fx(string).to("HKD")).toFixed(2);
            elems[i].textContent = "G" + x;
            elems[i].setAttribute("currency", "GBP");
        }
    }

    for (i in local) {
        let string = "$" + local[i].price + " USD ";
        local[i].price = parseFloat(fx(string).to("HKD")).toFixed(2);
    }
}