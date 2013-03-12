// coming soon: comments!
var baseUrl = "";
var maxRow = 0;
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

    yep: function() {

      chrome.tabs.getSelected(null,function(tab) {
        // do we have any GET params?
        var firstSplit = tab.url.split('?');
        if(firstSplit.length > 1)
        {
          baseUrl = firstSplit[0] + "?";
          var resTable = document.createElement('table');
          resTable.id = "nfurl_getstring_table";
          var getStrings = firstSplit[1].split('&');
          var i = 0;
          for(;i<getStrings.length;++i)
          {
            var newTr = document.createElement('tr');
            newTr.id = "nfurl_row" + i;

            var newDelTd = nfurlobj.makeDelTd(i);
            newTr.appendChild(newDelTd);

            var eq = getStrings[i].split('=');
            newTr.appendChild(nfurlobj.createTd(eq[0]));
            newTr.appendChild(nfurlobj.createTd(eq[1]));
            resTable.appendChild(newTr);
          }
          maxRow = i;
          document.body.appendChild(resTable);
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
        }
      });
    },

    delrow: function()
    {
      document.getElementById(this.parentRow).remove();
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
      chrome.tabs.getSelected(null,function(tab) {
        chrome.tabs.update(tab.id, {url:redirectUrl});
      });
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
  nfurlobj.yep();
});
