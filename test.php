<span style="float: right;color: red">&copy;</span> <div style="margin-top:0px;">
<span style="position: absolute" id="enrichment_waiting"><img width="160px" src="css/load1.gif" /></span>
 <script src='https://beta.plantgenie.org/js/jquery.min.js'></script>
 <script type='text/javascript' src='https://beta.plantgenie.org/js/jquery-ui.js'></script>

 <script  src="js/jquery.dataTables.min.js"></script>
 <script type='text/javascript'>
	  var MAIN_GENELIST_TABLE="popgenie_potri_v31";
	</script>

 <script  src="js/init.js"></script> 
     <link rel="stylesheet" type="text/css" href="css/jquery.dataTables.min.css">
     <link rel="stylesheet" type="text/css" href="css/style.css">
     <link rel="stylesheet" type="text/css" href="css/treemap.css">

     
       <div id="gene_ontology_treemap" style="width: 100%;overflow: visible;position: relative"></div>
        <input onclick="submit_revigo();" height="60px" type="button" id="revigo_btn" class="form-submit" value="SEND TO REVIGO" style=" outline:none;float: right;display: none;    margin-top: -40px;">

  <div id="filter">Select GO domain: </div>
  
 
<table style="float: right;display: none" id="scale_table"  border="0" cellspacing="0" cellpadding="4" width="890px"> 
        <tbody><tr><td align="right">Color code:</td><td bgcolor="#ffff00">0.1
                    </td><td bgcolor="#ffbb00">0.01
                    </td><td bgcolor="#ffaa11">10e-3
                    </td><td bgcolor="#ff9900">10e-4
                    </td><td bgcolor="#ff7700">10e-5
                    </td><td bgcolor="#ff5500"> 10e-6
                    </td><td bgcolor="#ff3300"> <font color="#FFFFFF">10e-7</font>
                    </td><td bgcolor="#cc2222"> <font color="#FFFFFF">10e-8</font>
                    </td><td bgcolor="#aa0000"> <font color="#FFFFFF">10e-9
        
        </font></td></tr></tbody></table>
 <div class="container_tmp">
    <table id="go_table"></table>
     <h4 id="pfam_label">PFAM</h4>
    <table id="pfam_table"></table>
</div>
 <br>
  </div>
<script src="//d3js.org/d3.v3.min.js"></script> 
<script src="js/treemap.js"></script>   
 