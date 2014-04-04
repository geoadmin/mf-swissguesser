## -*- coding: utf-8 -*-
<%!
from HTMLParser import HTMLParser

class MLStripper(HTMLParser):
    def __init__(self):
        self.reset()
        self.fed = []
    def handle_data(self, d):
        self.fed.append(d)
    def get_data(self):
        return ''.join(self.fed)

def strip_tags(html):
    s = MLStripper()
    s.feed(html)
    return s.get_data()
%>
<!--[if HTML5]><![endif]-->
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
<head lang="${lang}">
	<!--[if !HTML5]>
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<![endif]-->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1, user-scalable=0">
	<link href="http://www.swisstopo.admin.ch/internet/swisstopo.ConfigFavicon.ico" type="image/x-icon" rel="Shortcut Icon">

	<title>${Start_Title|strip_tags}</title>
	<meta name="description" content="${Start_Text|strip_tags}"/>
	<!-- Facebook tags -->
	<meta property="og:site_name" content="geo.admin.ch storymaps"/>
	<meta property="og:image" content="${Preview_Url}" /> 
	<meta property="og:title" content="${Start_Title}" />
	<meta property="og:description" content="${Start_Text|strip_tags}">
	<!-- Google+ tags -->
	<meta itemprop="name" content="${Start_Title}">
	<meta itemprop="description" content="${Start_Text|strip_tags}">
	<meta itemprop="image" content="${Preview_Url}">

	<!-- Compiled page styles -->
	<link rel="stylesheet" href="../styles/main.css">
        <!-- Custom style for this Guesser -->
        <link rel="stylesheet" href="styles/custom.css" type="text/css">
	<!-- build:js scripts/vendor/modernizr.js -->
	<script src="../libs/modernizr/modernizr.js"></script>
	<!-- endbuild -->
</head>
<body>

<nav id="header" class="navbar navbar-fixed-top" role="navigation"><div class="container">
	<div class="webBlindThis">
		Accesskeys:
		<ul>
		<li><a href="/" accesskey="0">Zur Startseite</a></li>
		<li><a href="http://www.geo.admin.ch/internet/geoportal/de/tools/contact.html" accesskey="1">Zum Kontakt</a></li>
		<li><a href="http://www.geo.admin.ch/internet/geoportal/de/tools/sitemap.html" accesskey="2">Zur Übersicht</a></li>
		<li><a href="http://www.geo.admin.ch/internet/geoportal/de/tools/what_where.html" accesskey="3">Zur Suche</a></li>
		</ul>
	</div>
	<div class="navbar-header logo">
		<h1 class="navbar-brand" href="#" data-i18n="App-Title" style="display:none">SwissGuesser</h1>

		<div id="webHeaderDiv">
			<!--UdmComment-->
			<div id="webHeaderLinks">
			<div id="adminch"><a href="http://www.admin.ch/" data-i18n="Head-CH"></a></div>
			<div id="depart"><a href="${Link_EDI}" data-i18n="Head-EDI"></a></div>
			<a href="${Link_BAR}" data-i18n="Head-BAR"></a>
			</div>
			<!--/UdmComment-->
		</div>
		<button class="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
			<span class="sr-only" data-i18n="App-Menu">Menu</span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
		</button>
		<div class="navbar-toggle mobile-switch">
			<button class="btn btn-default active" type="button" data-target="#d-photobox" data-i18n="Toggle-Photo">Photo</button>
			<button class="btn btn-default" type="button" data-target="#column-map" data-i18n="Toggle-Map">Map</button>
		</div>
	</div>
	<div class="navServiceBackground">
	<ul class="inline-list">
		<li><b>Share:</b></li>
		<li><a href="http://www.facebook.com/sharer.php?u=${App_Url|u}" title="Facebook"><img src="../images/social/facebook.gif" alt="Facebook" width="13" height="13"></a></li>
		<li><a href="http://twitter.com/intent/tweet?url=${App_Url|u}" title="Twitter"><img src="../images/social/twitter.gif" alt="Facebook" width="13" height="13"></a></li> 
		<li><a href="http://google.com/bookmarks/mark?op=edit&amp;bkmk=${App_Url|u}" title="Google Bookmarks"><img src="../images/social/google.gif" alt="Google Bookmarks" width="13" height="13"></a></li> 
		<li><a href="https://plus.google.com/share?url=h${App_Url|u}" title="Google+"><img src="../images/social/googleplus.gif" alt="Google+" width="13" height="13"></a></li> 
		<li class="spacer"></li>
		<li><a tabindex="-1" href="?lang=de">Deutsch</a></li>
		<li class="pipe">&nbsp;</li>
	    <li><a tabindex="-1" href="?lang=fr">Français</a></li>
	    <li class="pipe">&nbsp;</li>
	    <li><a tabindex="-1" href="?lang=it">Italiano</a></li>
	    <li class="pipe">&nbsp;</li>
		<li><a tabindex="-1" href="?lang=en">English</a></li>
	</ul>
	</div>
	<div class="collapse navbar-collapse" id="navbar-main"><ul class="nav navbar-nav pull-right">
		<li>
			<a href="#" data-target="#d-start" data-toggle="modal" data-i18n="App-About">About</a>
		</li>
		<li class="dropdown" id="language">
			<a class="dropdown-toggle" data-toggle="dropdown" href="#"><span data-i18n="App-Lang">Language</span> <span class="caret"></span></a>
			<ul class="dropdown-menu" aria-labelledby="language">
			    <li><a tabindex="-1" href="?lang=de" lang="de">Deutsch</a></li>
			    <li><a tabindex="-1" href="?lang=fr" lang="fr">Français</a></li>
			    <li><a tabindex="-1" href="?lang=it" lang="it">Italiano</a></li>
				<li><a tabindex="-1" href="?lang=en" lang="en">English</a></li>
			</ul>
		</li>
		<li class="dropdown">
			<a class="dropdown-toggle" data-toggle="dropdown" href="#" id="language"><span data-i18n="App-Share">Share</span> <span class="caret"></span></a>
			<ul class="dropdown-menu" aria-labelledby="language">
				<li><a href="http://www.facebook.com/sharer.php?u=${App_Url|u}"tabindex="-1"><img class="icon" src="../images/social/facebook_big.png" width="64" height="64"> Facebook</a></li> 
				<li><a href="http://twitter.com/intent/tweet?url=${App_Url|u}" tabindex="-1"><img class="icon" src="../images/social/twitter_big.png" width="64" height="64"> Twitter</a></li>
				<li><a href="https://plus.google.com/share?url=${App_Url|u}" tabindex="-1"><img class="icon" src="../images/social/googleplus_big.png" width="64" height="64"> Google+</a></li>
			</ul>
		</li>
	</ul></div>
</div></nav>

<div class="container container-main">
<div class="col-md-12 hidden" id="loading" data-i18n="Start-Loading">
	Please wait, loading ...
</div>
<div class="col-md-6 on hidden" id="d-photobox">

	<div class="d-photo">
		<a data-toggle="modal" href="#d-lightbox">
			<span class="glyphicon glyphicon-fullscreen"></span>
		</a>
	</div>
	<div class="d-copyright">
        % if project == 'storymap5':
		    <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/ch/">CC-BY-SA 3.0-CH</a>
        % endif
		<a href="${Photo_Copyright_Link}" data-i18n="Photo-Copyright"></a>
	</div>
	<p class="hidden">
	  <span class="d-photo-text" data-i18n="Photo-Text"></span>
	  <a href="#map"><span class="glyphicon glyphicon-map-marker"></span></a>
	</p>

	<div id="d-result" class="overlay hidden alert alert-warning">

		<div class="info"><p></p></div>

		<p class="result">
		  <span data-i18n="Result-Score"></span> 
		  <b class="distance"></b> 
		  <span data-i18n="Result-From">km from the correct location and got</span>
		  <b class="score"></b> 
		  <span data-i18n="Result-Points">points.</span>
		  <span class="comment"></span>
		</p>

		<div id="v-finish" class="hidden">
			<p class="message"></p>

			<div class="sharebox">
				<form class="shareicon shareform">
					<button type="button" class="btn btn-default btn-sm btn-copy">
						<input type="text" name="url">
						<a>Link</a></button>
				</form>

				<div class="shareicon">
					<button type="button" class="btn btn-default btn-sm btn-twitter">
						<span class="icon-twitter"></span>
						Tweet</button>
				</div>

				<div class="shareicon">
					<button type="button" class="btn btn-default btn-sm btn-facebook">
						<span class="glyphicon glyphicon-thumbs-up"></span>
						Like</button>
				</div>

				<div class="shareicon">
					<button type="button" class="btn btn-default btn-sm btn-email">
						<span class="glyphicon glyphicon-envelope"></span> 
						E-mail</button>
				</div>
			</div><!-- /sharebox -->

		</div><!-- /v-finish -->
	</div><!-- /d-result -->

</div><!-- /#d-photobox -->
<div class="col-md-6" id="column-map">

  <div id="map" class="map"></div>

  <div style="display:none">
	  <div id="map-overlay"></div>
  </div>
  
</div><!-- /.column-map -->
<div class="col-md-12 hidden" id="row-info">

	<div class="mobile-switch">
		<button class="btn btn-default" type="button" data-target="#column-map" data-i18n="Game-Guess">Guess</button>

		<button id="btn-guess" class="btn btn-primary hidden" type="button" data-target="#column-map" data-i18n="Game-Confirm">Confirm</button>

		<button id="btn-continue-mobile" class="btn btn-primary hidden" type="button" data-target="#d-photobox" data-i18n="Result-Continue">Continue</button>

		<button id="btn-continue" class="btn btn-primary hidden" type="button" data-target="#d-photobox" data-dismiss="modal" data-i18n="Result-Continue">Continue</a>

		<button id="btn-finish" type="button" class="btn btn-primary hidden" data-i18n="Finish-Restart">New Game</button>
	</div>

	<button type="button" class="btn btn-default restart" onClick="location.reload()" data-i18n="Photo-Restart"></button>

	<p><span data-i18n="Result-Total"></span> <span class="total"></span></p>

	<h4 id="label-photo" class="panel-title">
		<span data-i18n="Photo-Counter"></span> <span class="image-count"></span>
		/ <span class="image-total"></span>
	</h4>

</div><!-- /.row-info -->
</div><!-- /container -->

<div id="d-start" class="modal" aria-labelledby="label-intro" aria-hidden="true" tabindex="-1" role="dialog">
	<div class="modal-dialog">
	<div class="modal-content">
		<div class="modal-header">
			<button type="button" class="close" href="#d-photobox" data-dismiss="modal" aria-hidden="true">&times;</button>
			<span data-i18n="Start-Title"></span>
		</div>
		<div class="modal-body">
			<p data-i18n="[html]Start-Text;"></p>
			<p class="modal-divider">
				<span data-i18n="Start-Credit"></span>: 
				<a href="http://api3.geo.admin.ch/" target="_blank">api3.geo.admin.ch</a><br>
				<a id="s-copyright" href="http://www.geo.admin.ch/internet/geoportal/de/home/geoadmin/contact.html#copyright" target="_blank"><span data-i18n="Start-Copyright"></span></a>
			</p>
		</div>
		<div class="modal-footer">
			<button id="btn-start" type="button" class="btn btn-primary" href="#d-photobox" data-dismiss="modal" data-i18n="Game-Start">Start</button>
			<button id="btn-close" type="button" class="btn btn-primary hidden"data-dismiss="modal" data-i18n="Game-Close">Close</button>
		</div>
	</div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<div id="d-lightbox" class="modal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="lightbox-content">
		<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
		<a href="#" data-dismiss="modal"><img width="100%" draggable="false" /></a>
		<div class="d-copyright">
			<a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/ch/">CC-BY-SA 3.0-CH</a>
			<a href="http://www.swiss-archives.ch" data-i18n="Photo-Copyright"></a>
		</div>
	</div>
</div>

<!--[if lte IE 8]>
<p class="browsehappy">
	<button type="button" class="close" onclick="$(this).parent().remove()" aria-hidden="true">&times;</button>
	<span data-i18n="App-Warning">You are using an outdated browser. Please upgrade to improve your experience.</span>
	<a href="http://browsehappy.com/">browsehappy.com</a>
</p>
<![endif]-->
<noscript><p class="browsehappy">Please enable JavaScript to use this app.</p></noscript>
<script language="JavaScript">/* Quirks mode / ancient IE */ if (document.documentMode && document.documentMode < 8 && window.confirm("Please upgrade your browser to use this website.")) document.location.href = "http://browsehappy.com/"; </script>

<!-- build:js scripts/vendor/bootstrap.js -->
<script src="../libs/jquery/jquery.js"></script>
<script src="../libs/bootstrap/dist/js/bootstrap.js"></script>

<!-- endbuild -->

<!-- build:js scripts/i18next.js -->
<script src="../libs/i18next/i18next.min.js"></script>
<!-- endbuild -->

<!-- OpenLayers for GeoAdmin -->
<script src="//api3.geo.admin.ch/loader.js"></script>

<!-- build:js scripts/swissguesser.js -->
<script src="../scripts/ol3-geoadmin.js"></script>
<script src="../scripts/guesser.js"></script>
<!-- endbuild -->


</body>
</html>

