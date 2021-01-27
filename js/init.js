var aaData = [];
var pfam_aaData = [];
var kegg_aaData = [];
var revigo_array = [];

// Debug code
reinitTool();

function reinitTool() {
    var tmpcookie = "potri";
    var types = ["go", "pfam", "kegg"];
    var genes = ["Potri.001G050200", "Potri.001G088501", "Potri.001G136200", "Potri.001G187900", "Potri.001G266400", "Potri.001G369100", "Potri.001G449301", "Potri.002G066600", "Potri.002G081100", "Potri.002G114200", "Potri.002G200300", "Potri.002G216600", "Potri.002G227300", "Potri.002G248400", "Potri.002G257900", "Potri.003G097100", "Potri.003G142200", "Potri.003G142300", "Potri.003G142400", "Potri.003G142500", "Potri.003G177800", "Potri.004G059600", "Potri.004G189000", "Potri.004G208800", "Potri.005G027600", "Potri.005G087500", "Potri.005G154200", "Potri.005G180100", "Potri.005G194200", "Potri.006G004166", "Potri.006G004232", "Potri.006G004300", "Potri.006G052600", "Potri.006G124301", "Potri.006G181900", "Potri.006G251900", "Potri.006G270900", "Potri.007G076500", "Potri.008G163700", "Potri.009G060800", "Potri.009G149700", "Potri.009G170000", "Potri.010G074700", "Potri.010G074800", "Potri.011G069600", "Potri.011G152300", "Potri.012G041500", "Potri.013G019800", "Potri.014G125100", "Potri.014G155300", "Potri.014G156200", "Potri.016G054900", "Potri.018G029400", "Potri.018G103900", "Potri.T071650"];

    $(".loader-wrap").show();
    if (genes.length == 0) {
        console.log("zero")
    }
    var req = {
        "target": types,
        "genes": genes,
        "include_defs": false,
        "alpha": 0.05
    };

    $('#gene_ontology_treemap').empty();
    $.ajax({
        type: "POST",
        contentType: "application/json",
        url: "//enrichment.plantgenie.org/" + tmpcookie + "/enrichment",
        data: JSON.stringify(req),
        dataType: "json",
        crossDomain: true,
        processData: false,
        success: function(data) {
            $("#filter").show();
            $("#go_label").show();
            $("#pfam_label").show();
            $("#kegg_label").show();
            $("#scale_table").show();
            $("#revigo_btn").show();

            $("#enrichment_waiting").hide();

            if (aaData.length != 0) {
                console.log("fired");
                $("#go_table").dataTable().fnDestroy();;
            }
            if (pfam_aaData.length != 0) {
                $("#pfam_table").dataTable().fnDestroy();;
            }
            if (kegg_aaData.length != 0) {
                $("#kegg_table").dataTable().fnDestroy();
            }
            $("#filter").html("Select GO domain: ");
            // console.log(data.go)
            var gene_ontology_array = [];
            for (var j = 0; j < data.go.length; j++) {
                if (data.go[j].pval.toPrecision(4) != -1) {
                    var ns = data.go[j]["namespace"];
                    ns = ns.replace("MF", "Molecular function");
                    ns = ns.replace("CC", "Cellular component");
                    ns = ns.replace("BP", "Biological process");
                    gene_ontology_array.push({
                        id: data.go[j]["id"],
                        pvalue: parseFloat(data.go[j].pval.toPrecision(4)),
                        nt: parseFloat(data.go[j]["nt"]),
                        npat: parseFloat(data.go[j]["npat"]),
                        value: Math.abs(Math.log10(parseFloat(data.go[j].pval.toPrecision(4)))),
                        namespace: ns,
                        name: data.go[j]["name"]
                    });

                    revigo_array.push(data.go[j]["id"] + "\t" + parseFloat(data.go[j].pval.toPrecision(4)));
                }
            }

            var datax = d3.nest().key(function(d) {
                return d.namespace;
            }).key(function(d) {
                return d.name;
            }).key(function(d) {
                return d.id;
            }).entries(gene_ontology_array);
            main({
                title: "Treemap"
            }, {
                key: "Gene Ontology",
                values: datax
            });




            for (i in data.go) {
                if (data.go[i].pval.toPrecision(4) != -1) {
                    var mp = "<span id='mt'>" + data.go[i].mt + "</span>/<span id='mpat'>" + data.go[i].mpat + "</span>";
                    var nt = "<span id='nt'>" + data.go[i].nt + "</span>/<span id='npat'>" + data.go[i].npat + "</span>";
                    aaData.push(["<a target='_blank' style='color:white;font-weight:normal' href='http://amigo.geneontology.org/amigo/term/" + data.go[i].id + "'>" + data.go[i].id + "</a>", data.go[i].name, mp + " <font color='red'><strong>|</strong></font> " + nt, data.go[i].pval.toPrecision(4), data.go[i].padj.toPrecision(4), data.go[i].namespace])
                }

            }
            for (j in data.pfam) {
                //console.log(data.pfam[j].id,data.pfam[j].m,data.pfam[j].mt,data.pfam[j].n,data.pfam[j].name)
                var pfam_mt = "<span id='pfam_mt'>" + data.pfam[j].mt + "</span>/<span id='pfam_m'>" + data.pfam[j].m + "</span>";
                var pfam_n = "<span id='pfam_nt'>" + data.pfam[j].nt + "</span>/<span id='pfam_n'>" + data.pfam[j].n + "</span>";
                pfam_aaData.push(["<a target='_blank' style='color:white;font-weight:normal' href='//pfam.xfam.org/family/" + data.pfam[j].id + "'>" + data.pfam[j].id + "</a>", data.pfam[j].name, pfam_mt + " <font color='red'><strong>|</strong></font> " + pfam_n, data.pfam[j].pval.toPrecision(4), data.pfam[j].padj.toPrecision(4)])
            }
            /*   for (h in data.kegg) {
                   //console.log(data.kegg[j].id,data.kegg[j].m,data.kegg[j].mt,data.kegg[j].n,data.kegg[j].name,data)
                   var kegg_mt = "<span id='kegg_mt'>" + data.kegg[h].mt + "</span>/<span id='kegg_m'>" + data.kegg[h].m + "</span>";
                   var kegg_n = "<span id='kegg_nt'>" + data.kegg[h].nt + "</span>/<span id='kegg_n'>" + data.kegg[h].n + "</span>";
                   kegg_aaData.push(["<a target='_blank' style='color:white;font-weight:normal' href='https://www.genome.jp/dbget-bin/www_bget?ec:" + data.kegg[h].id + "'>" + data.kegg[h].id + "</a>", data.kegg[h].pval.toPrecision(4), kegg_mt + " <font color='red'><strong>|</strong></font> " + kegg_n, data.kegg[h].name])
               }*/
            var gotable = $("#go_table").dataTable({
                "aaData": aaData,
                "iDisplayLength": 25,
                // -- snip -- //
                initComplete: function() {
                    this.api().columns(5).every(function() {
                        var column = this;
                        var selectDropdown = $('<select><option value="">All domains</option></select>').appendTo($('#filter')).on('change', function() {
                            var val = $.fn.dataTable.util.escapeRegex($(this).val());
                            column.search(val ? val + '$' : '', true, false).draw();
                        });
                        var dates = [];
                        column.data().unique().sort().each(function(d, j) {
                            var go_select_value = "";
                            if (d == "BP") {
                                go_select_value = "Biological process";
                            }
                            if (d == "MF") {
                                go_select_value = "Molecular function";
                            }
                            if (d == "CC") {
                                go_select_value = "Cellular component";
                            }
                            selectDropdown.append('<option value="' + d + '">' + go_select_value + '</option>')
                        });
                    });
                },
                // -- snip -- //
                /* columnDefs: [  {
            targets: [ 1 ],
            orderData: [ 1, 0 ]
        }, {
            targets: [ 4 ],
            orderData: [ 4, 1 ]
        } ]
,*/
                "columnDefs": [{
                    "targets": [5],
                    "visible": false,
                    "searchable": true
                }],
                "createdRow": function(row, data, dataIndex) {
                    var pval = parseFloat(data[3]).toFixed(10);
                    if (pval > 0.01) {
                        $(row).addClass('rowpval1');
                    }
                    if (0.01 >= pval > 0.001) {
                        $(row).addClass('rowpval2');
                    }
                    if (0.001 >= pval > 0.0001) {
                        $(row).addClass('rowpval3');
                    }
                    if (0.0001 >= pval > 0.00001) {
                        $(row).addClass('rowpval4');
                    }
                    if (0.00001 >= pval > 0.000001) {
                        $(row).addClass('rowpval5');
                    }
                    if (0.000001 >= pval > 0.0000001) {
                        $(row).addClass('rowpval6');
                    }
                    if (0.0000001 >= pval > 0.00000001) {
                        $(row).addClass('rowpval7');
                    }
                    if (0.00000001 >= pval > 0.000000001) {
                        $(row).addClass('rowpval8');
                    }
                    if (0.000000001 >= pval > 0.0000000001) {
                        $(row).addClass('rowpval9');
                    }
                    if (0.0000000001 >= pval) {
                        $(row).addClass('rowpval10');
                    }
                },
                "aaSorting": [
                    [3, "asc"],
                    [4, "asc"]
                ],
                "bJQueryUI": true,
                "aoColumns": [{
                        "sTitle": "ID",
                        "sWidth": "10%",
                        sClass: "alignLeft"
                    }, {
                        "sTitle": "Description",
                        "sWidth": "40%",
                        sClass: "alignLeft"
                    }, {
                        "sTitle": "Statistics (mt/mpat | nt/npat)",
                        "sWidth": "30%",
                        sClass: "alignLeft"
                    }, {
                        "sTitle": "P-value",
                        "sWidth": "15%",
                        sClass: "alignLeft"
                    },
                    {
                        "sTitle": "q-value",
                        "sWidth": "15%",
                        sClass: "alignLeft"
                    }

                    , {
                        "sTitle": "Namespace",
                        "sWidth": "0%",
                        sClass: "alignLeft"
                    }
                ]
            })
            $(".loader-wrap").fadeOut("slow");
            var pfamtable = $("#pfam_table").dataTable({
                "aaData": pfam_aaData,
                "iDisplayLength": 25,
                "createdRow": function(row, data, dataIndex) {
                    var pval = parseFloat(data[3]).toFixed(10);
                    if (pval > 0.01) {
                        $(row).addClass('rowpval1');
                    }
                    if (0.01 >= pval > 0.001) {
                        $(row).addClass('rowpval2');
                    }
                    if (0.001 >= pval > 0.0001) {
                        $(row).addClass('rowpval3');
                    }
                    if (0.0001 >= pval > 0.00001) {
                        $(row).addClass('rowpval4');
                    }
                    if (0.00001 >= pval > 0.000001) {
                        $(row).addClass('rowpval5');
                    }
                    if (0.000001 >= pval > 0.0000001) {
                        $(row).addClass('rowpval6');
                    }
                    if (0.0000001 >= pval > 0.00000001) {
                        $(row).addClass('rowpval7');
                    }
                    if (0.00000001 >= pval > 0.000000001) {
                        $(row).addClass('rowpval8');
                    }
                    if (0.000000001 >= pval > 0.0000000001) {
                        $(row).addClass('rowpval9');
                    }
                    if (0.0000000001 >= pval) {
                        $(row).addClass('rowpval10');
                    }

                },
                "aaSorting": [
                    [3, "asc"]
                ],
                "bJQueryUI": true,
                "aoColumns": [{
                        "sTitle": "ID",
                        "sWidth": "10%",
                        sClass: "alignLeft"
                    }, {
                        "sTitle": "Description",
                        "sWidth": "20%",
                        sClass: "alignLeft"
                    }, {
                        "sTitle": "Statistics",
                        "sWidth": "20%",
                        sClass: "alignLeft"
                    }, {
                        "sTitle": "P-value",
                        "sWidth": "10%",
                        sClass: "alignLeft"
                    },
                    {
                        "sTitle": "q-value",
                        "sWidth": "10%",
                        sClass: "alignLeft"
                    }
                ]
            })
            var keggtable = $("#kegg_table").dataTable({
                "aaData": kegg_aaData,
                "iDisplayLength": 25,
                "createdRow": function(row, data, dataIndex) {
                    var pval = parseFloat(data[1]).toFixed(10);
                    if (pval > 0.01) {
                        $(row).addClass('rowpval1');
                    }
                    if (0.01 >= pval > 0.001) {
                        $(row).addClass('rowpval2');
                    }
                    if (0.001 >= pval > 0.0001) {
                        $(row).addClass('rowpval3');
                    }
                    if (0.0001 >= pval > 0.00001) {
                        $(row).addClass('rowpval4');
                    }
                    if (0.00001 >= pval > 0.000001) {
                        $(row).addClass('rowpval5');
                    }
                    if (0.000001 >= pval > 0.0000001) {
                        $(row).addClass('rowpval6');
                    }
                    if (0.0000001 >= pval > 0.00000001) {
                        $(row).addClass('rowpval7');
                    }
                    if (0.00000001 >= pval > 0.000000001) {
                        $(row).addClass('rowpval8');
                    }
                    if (0.000000001 >= pval > 0.0000000001) {
                        $(row).addClass('rowpval9');
                    }
                    if (0.0000000001 >= pval) {
                        $(row).addClass('rowpval10');
                    }
                },
                "aaSorting": [
                    [1, "asc"]
                ],
                "bJQueryUI": true,
                "aoColumns": [{
                    "sTitle": "ID",
                    "sWidth": "10%",
                    sClass: "alignLeft"
                }, {
                    "sTitle": "P-value",
                    "sWidth": "10%",
                    sClass: "alignLeft"
                }, {
                    "sTitle": "Statistics",
                    "sWidth": "10%",
                    sClass: "alignLeft"
                }, {
                    "sTitle": "Description",
                    "sWidth": "20%",
                    sClass: "alignLeft"
                }]
            })
        }
    })
}


function submit_revigo() {
    var form = document.createElement("form");
    var revigo_text_element = document.createElement("input");
    // var revigo_link_element = document.createElement("input");


    form.method = "POST";
    form.action = "http://revigo.irb.hr";
    //form.acceptCharset="UTF-8";


    /*$("#theLink").text(theLinkDetails[n-1][0]);
                $("#theLink").attr("href", theLinkDetails[n-1][1]);
                $("#theLinkSpan").show();
                $("#goList1").val(data);
                content = $("#goList1").val();*/

    //revigo_link_element.value="PlantGenIE";
    //revigo_link_element.name="theLink";
    //form.appendChild(revigo_link_element);
    revigo_text_element.type = 'text';
    var str_tmp = revigo_array.join("\r\n").replace(/(\r\n|\n|\r)/gm, "");
    revigo_text_element.value = str_tmp;
    //revigo_text_element.value=str_tmp;
    revigo_text_element.name = "inputGoList";
    form.appendChild(revigo_text_element);

    console.log(form)

    document.body.appendChild(form);
    form.target = '_blank';
    form.submit();

}



/***
 *** SET and GET cookies
 ***/
function setCookie(c_name, value, exdays) {
    //if(getCookie(c_name)==null){
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
    document.cookie = c_name + "=" + c_value;
    //}
}

function getCookie(c_name) {
    var c_value = document.cookie;
    var c_start = c_value.indexOf(" " + c_name + "=");
    if (c_start == -1) {
        c_start = c_value.indexOf(c_name + "=");
    }
    if (c_start == -1) {
        c_value = null;
    } else {
        c_start = c_value.indexOf("=", c_start) + 1;
        var c_end = c_value.indexOf(";", c_start);
        if (c_end == -1) {
            c_end = c_value.length;
        }
        c_value = unescape(c_value.substring(c_start, c_end));
    }
    return c_value;
}

function pad2(number) {
    return (number < 10 ? 0 : '') + number;
}