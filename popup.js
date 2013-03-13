// coming soon: comments!
var baseUrl = "";
var maxRow = 0;
var baseDomain = "";
var nfepUrls = {
    "FormKey": "/nfep/iWeb/forms/DynamicProfile.aspx?ItemKey=1ffc17dd-f961-4701-a13c-6565adfac937&LinkKey=b82ec628-4206-4457-9562-7b2ed8029b23&FormKey=4cdb590a-ed8b-4e42-894c-338cd03d799b&tab=Toolkit&tabitem=Forms&key="
    , "WizardKey": "/nfep/iWeb/forms/DynamicEdit.aspx?ItemKey=ef6ad6c1-7512-4167-9d9d-b5b994d3c288&LinkKey=66d53ff8-b86a-4ddf-bac1-d27a7675130a&FormKey=ea52fe3a-4b18-479f-b1c1-490ea2ef7cfe&tab=Toolkit&tabitem=Wizards&key="
    , "WebKey": "/nfep/iWeb/forms/DynamicEdit.aspx?ItemKey=1089c975-4116-4e63-8c98-f0a1844f285e&LinkKey=bd75a069-a4fd-4949-9828-054c61b20727&FormKey=dbf6f615-291f-448d-adf8-67df81d8de93&tab=CMS&tabitem=Web%20Page&key="
};

var nfurlobj = {


    createTd: function(str)
    {
      var ret = document.createElement('td');
      var inp = document.createElement('input');
      inp.type = "text";
      inp.value = str;
      ret.appendChild(inp);
      return ret;
    },


    makeDelTd: function(i)
    {
      var delTd = document.createElement("td");
      var delbtn = document.createElement("input");
      delbtn.type = "submit";
      delbtn.value = "x";
      delbtn.parentRow = "nfurl_row" + i;
      delbtn.id = "nfurl_del_button" + i;
      delbtn.onclick = nfurlobj.delrow;
      delTd.appendChild(delbtn);
      return delTd;
    },

    makeBtn: function(txt, fx)
    {
      var btn = document.createElement("input");
      btn.type = "submit";
      btn.value = txt;
      btn.onclick = fx;
      return btn;
    },
    
    getStringTable: function()
    {
      return document.getElementById("nfurl_getstring_table");
    },

    makeAnchorTd: function(key, val)
    {
        //alert("" + key + ", " + val);
        var retTd = document.createElement("td");
        if (nfepUrls[key])
        {
            var anch = document.createElement("a");
            anch.href = baseDomain + nfepUrls[key] + val;
            anch.innerText = "edit";
            anch.onclick = function () { nfurlobj.redirect(this.href); };
            retTd.appendChild(anch);
        }
        return retTd;
    },

    addNewRow: function(l,r)
    {

      var newTr = document.createElement('tr');
      maxRow += 1;
      newTr.id = "nfurl_row" + maxRow;

      var newDelTd = nfurlobj.makeDelTd(maxRow);
      newTr.appendChild(newDelTd);

      newTr.appendChild(nfurlobj.createTd(l));
      newTr.appendChild(nfurlobj.createTd(r));
      newTr.appendChild(nfurlobj.makeAnchorTd(l, r));
      nfurlobj.getStringTable().appendChild(newTr);
    },

    showPopup: function() {

      chrome.tabs.getSelected(null,function(tab) {
        // do we have any GET params?
        var firstSplit = tab.url.split('?');
        if(firstSplit.length > 1)
        {
            baseUrl = firstSplit[0] + "?";
            var urlParts = baseUrl.split("//");
            baseDomain = urlParts[0] + "//" + urlParts[1].split("/")[0];
          var resTable = document.createElement('table');
          resTable.id = "nfurl_getstring_table";
          var getStrings = firstSplit[1].split('&');
          document.body.appendChild(resTable);
          var i = 0;
          for(;i<getStrings.length;++i)
          {
          
              var eq = getStrings[i].split('=');
              nfurlobj.addNewRow(eq[0], eq[1]);
          }
          maxRow = i;
          
          var btn = document.createElement("input");
          btn.type = "submit";
          btn.value = "rejoin";
          btn.onclick = function (){nfurlobj.reJoin()};
          document.body.appendChild(btn);

          var btn2 = document.createElement("input");
          btn2.type = "submit";
          btn2.value = "design";
          btn2.id = "nfurl_design_button";
          if(tab.url.indexOf("design=yes")>0)
          {
            btn2.disabled=1;
          }
          btn2.onclick = function (){nfurlobj.addDesignYes();};
          document.body.appendChild(btn2);

          document.body.appendChild(nfurlobj.makeBtn("+", function(){nfurlobj.addNewRow("","");}));
        }
      });
    },

    delrow: function()
    {
      var inps = document.getElementById(this.parentRow).getElementsByTagName("input");
      // if we're removing the design = "yes" row, re-enable the button
      if(inps[1].value == "design" && inps[2].value == "yes")
      {
        document.getElementById("nfurl_design_button").disabled = 0;
      }
      document.getElementById(this.parentRow).remove();
    },

    redirect: function(redirectUrl)
    {
        chrome.tabs.getSelected(null, function (tab) {
            chrome.tabs.update(tab.id, { url: redirectUrl });
        });
    },

    reJoin: function()
    {
      var trs = document.getElementsByTagName("tr");
      var retStrs = [];
      var i = 0;
      var redirectUrl = "";
      for(;i<trs.length;++i)
      {
        inps =trs[i].getElementsByTagName("input");
        retStrs.push("" + inps[1].value + "=" +inps[2].value);
      }
      redirectUrl = baseUrl + retStrs.join("&");
      nfurlobj.redirect(redirectUrl);
    },

    addDesignYes: function()
    {
      var tbl = document.getElementsByTagName("table")[0];
      var ttr = document.createElement("tr");
      maxRow += 1;
      ttr.appendChild(nfurlobj.makeDelTd(maxRow));
      ttr.appendChild(nfurlobj.createTd("design"));
      ttr.appendChild(nfurlobj.createTd("yes"));
      tbl.appendChild(ttr);
      nfurlobj.reJoin();
      document.getElementById("nfurl_design_button").disabled = 1;
    },

};

document.addEventListener('DOMContentLoaded', function () {
  nfurlobj.showPopup();
});
