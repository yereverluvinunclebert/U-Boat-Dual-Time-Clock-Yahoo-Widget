//===========================================================================
// functions.js
// U Boat widget  1.5
// Originally written and Steampunked by: Dean Beedell
// Dean.beedell@lightquick.co.uk
// Vitality code, advice and patience from Harry Whitfield
//
//===========================================================================
//add the help
//add the relative positioning for landscape/portrait

/*jslint multivar */

/*property
	clockFaceSwitchPref, contextMenuItems, hLocationPercPref, hOffset, height,
	hoffset, itemExists, landscapeHoffsetPref, landscapeVoffsetPref, locked,
	onContextMenu, onMouseDown, onSelect, opacity, portraitHoffsetPref,
	portraitVoffsetPref, reveal, soundPref, title, tooltip, userWidgetsFolder,
	vLocationPercPref, vOffset, value, visible, voffset, widgetHideModePref,
	widgetLockLandscapeModePref, widgetLockPortraitModePref, width
*/

"use strict";

var mainWindow, mainWindowwidthDefault, mainWindowheightDefault,
		cableWheelSet, cableWheelSethoffsetDefault, cableWheelSetvoffsetDefault,
		cableWheelSetwidthDefault, cableWheelSetheightDefault, cable, cablehoffsetDefault,
		cablevoffsetDefault, cablewidthDefault, cableheightDefault, pipes, pipeshoffsetDefault,
		pipesvoffsetDefault, pipeswidthDefault, pipesheightDefault, bell, bellhoffsetDefault,
		bellvoffsetDefault, bellwidthDefault, bellheightDefault, indicatorRed,
		indicatorRedhoffsetDefault, indicatorRedvoffsetDefault, indicatorRedwidthDefault,
		indicatorRedheightDefault, speaker, speakerhoffsetDefault, speakervoffsetDefault,
		speakerwidthDefault, speakerheightDefault, bar, barhoffsetDefault, barvoffsetDefault,
		barwidthDefault, barheightDefault, sliderSet, sliderSethoffsetDefault,
		sliderSetvoffsetDefault, sliderSetwidthDefault, sliderSetheightDefault, text1,
		text1hoffsetDefault, text1voffsetDefault, text1fontDefault, text2, text2hoffsetDefault,
		text2voffsetDefault, text2fontDefault, tingingSound, startup, aspectRatio, displayLicence,
		widgetName, switchFaces, prefs, till, background2, background, smallHourHand, smallMinuteHand,
		swSecondHand, swMinuteHand, swHourHand, dateText, secondtextxo, secondtextyo, sizeClock,
		pin, lock, stopWatchState, mistake;


//======================================================================================
// Function to move the main_window onto the main screen - called on startup and by timer
//======================================================================================
function mainScreen() {
// if the widget is off screen then move into the viewable window

	print("****************MAINSCREEN********************");

	// check for aspect ratio and determine whether it is in portrait or landscape mode
	if (screen.width > screen.height) {
		aspectRatio = "landscape";
	} else {
		aspectRatio = "portrait";
	}
	print("screen.width " + screen.width);
	print("screen.height " + screen.height);
	print("aspectRatio " + aspectRatio);
	// check if the widget has a lock for the screen type.
	if (aspectRatio === "landscape") {
		if (preferences.widgetLockLandscapeModePref.value === "enabled") {
			mainWindow.hoffset = preferences.landscapeHoffsetPref.value;
			mainWindow.voffset = preferences.landscapeVoffsetPref.value;
		}
		if (preferences.widgetHideModePref.value === "landscape") {
			print("Hiding the widget for landscape mode");
			widget.visible = false;
		} else {
			widget.visible = true;
		}
	}
	// check if the widget has a lock for the screen type.
	if (aspectRatio === "portrait") {
		if (preferences.widgetLockPortraitModePref.value === "enabled") {
			mainWindow.hoffset = preferences.portraitHoffsetPref.value;
			mainWindow.voffset = preferences.portraitVoffsetPref.value;
		}
		if (preferences.widgetHideModePref.value === "portrait") {
			print("Hiding the widget for portrait mode");
			widget.visible = false;
		} else {
			widget.visible = true;
		}
	}

	if (mainWindow.hOffset < 0) {
		mainWindow.hOffset = 10;
	}
	if (mainWindow.vOffset < 0) {
		mainWindow.vOffset = 0; // avoid Mac toolbar
	}
	if (mainWindow.hOffset > screen.width - 50) { //adjust for the extra width of the help page
		mainWindow.hOffset = screen.width - mainWindow.width + 220;
	}
	if (mainWindow.vOffset > screen.height - 150) {	 //adjust for the extra height of the help page
		mainWindow.vOffset = screen.height - mainWindow.height; // avoid Mac toolbar
	}

	// calculate the current hlocation in % of the screen
	//store the current hlocation in % of the screen
	if (preferences.hLocationPercPref.value !== "") {
		preferences.hLocationPercPref.value = String((mainWindow.hoffset / screen.width) * 100);
	}
	if (preferences.vLocationPercPref.value !== "") {
		preferences.vLocationPercPref.value = String((mainWindow.voffset / screen.height) * 100);
	}

}
//=====================
//End function
//=====================

//===========================================
// this function opens the online help file
//===========================================
function menuitem1OnClick() {
	var answer = alert("This button opens a browser window and connects to the help page for this widget. Do you wish to proceed?", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("http://lightquick.co.uk/instructions-for-the-u-boat-dual-clock-widget.html");
	}
}
//=====================
//End function
//=====================
//===========================================
// this function opens the URL for paypal
//===========================================
function menuitem2OnClick() {
    var answer = alert("Help support the creation of more widgets like this, send us a coffee! This button opens a browser window and connects to the Kofi donate page for this widget). Will you be kind and proceed?", "Open Browser Window", "No Thanks");

    if (answer === 1) {
                openURL("https://www.ko-fi.com/yereverluvinunclebert");
    }
}
//=====================
//End function
//=====================
//===========================================
// this function opens my Amazon URL wishlist
//===========================================
function menuitem3OnClick() {
	var answer = alert("Help support the creation of more widgets like this. Buy me a small item on my Amazon wishlist! This button opens a browser window and connects to my Amazon wish list page). Will you be kind and proceed?", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("http://www.amazon.co.uk/gp/registry/registry.html?ie=UTF8&id=A3OBFB6ZN4F7&type=wishlist");
	}
}
//=====================
//End function
//=====================
//===========================================
// this function opens the rocketdock URL
//===========================================
function menuitem4OnClick() {

	var answer = alert("Log in and vote for the widget on Rocketdock. This button opens a browser window and connects to the Rocketdock page where you can give the widget a 5 star rating... Will you be kind and proceed?", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("http://rocketdock.com/addon/misc/45672");
	}
}
//=====================
//End function
//=====================
//===========================================
// this function opens other widgets URL
//===========================================
function menuitem5OnClick() {
	var answer = alert("This button opens a browser window and connects to the Steampunk widgets page on my site. Do you wish to proceed", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("http://lightquick.co.uk/steampunk-widgets.html?Itemid=264");
	}
}
//=====================
//End function
//=====================
//===========================================
// this function opens the download URL
//===========================================
function menuitem6OnClick() {
	var answer = alert("Download latest version of the widget - this button opens a browser window and connects to the widget download page where you can check and download the latest zipped .WIDGET file). Proceed?", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("http://lightquick.co.uk/downloads/u-boat-dual-time-clock-yahoo-widget.html?Itemid=264");
	}
}
//=====================
//End function
//=====================
//===========================================
// this function opens the browser at the contact URL
//===========================================
function menuitem7OnClick() {
	var answer = alert("Visiting the support page - this button opens a browser window and connects to our contact us page where you can send us a support query or just have a chat). Proceed?", "Open Browser Window", "No Thanks");

	if (answer === 1) {
		openURL("http://lightquick.co.uk/contact.html?Itemid=3");
	}
}
//=====================
//End function
//=====================

//===========================================
// this function allows a spacer in the menu
//===========================================
function nullfunction() {
	print("null");
}
//=====================
//End function
//=====================


//===========================================
// this function causes explorer to be opened and the file selected
//===========================================
function findWidget() {

 // temporary development version of the widget
    var widgetFullPath = convertPathToPlatform(system.userWidgetsFolder + "/" + widgetName);
    var alertString = "The widget folder is: \n";
    if (filesystem.itemExists(widgetFullPath)) {
        alertString += system.userWidgetsFolder + " \n\n";
        alertString += "The widget name is: \n";
        alertString += widgetName + ".\n ";

        alert(alertString, "Open the widget's folder?", "No Thanks");

        filesystem.reveal(widgetFullPath);
    } else {
        widgetFullPath = resolvePath(".");   
        filesystem.reveal(widgetFullPath);
        print("widgetFullPath " + widgetFullPath);
    }
}
//=====================
//End function
//=====================

//=========================================================================
// this function assigns translations to preference descriptions and titles
//=========================================================================
function setmenu() {
	mainWindow.onContextMenu = function () {
        var items = [], mItem;

        mItem = new MenuItem();
        mItem.title = "Online Help";
        mItem.onSelect = function () {
            menuitem1OnClick();
        };
      	items.push(mItem);
      
        mItem = new MenuItem();
        mItem.title = "Donate a Coffee with Ko-Fi";
        mItem.onSelect = function () {
            menuitem2OnClick();
        };
      	items.push(mItem);
      
        mItem = new MenuItem();
        mItem.title = "";
        mItem.onSelect = function () {
            nullfunction();
        };
        items.push(mItem);
                
         mItem = new MenuItem();
         mItem.title = "U-Boat Help";
         mItem.onSelect = function () {
             tankHelpShow();
         };
         items.push(mItem);
 
         mItem = new MenuItem();
         mItem.title = "Online Help and other online options";
         items.push(mItem);
 
         sItem = new MenuItem();
         sItem.title = "See More Steampunk Widgets";
         sItem.onSelect = function () {
             menuitem5OnClick();
         };
         mItem.appendChild(sItem);
 
         sItem = new MenuItem();
         sItem.title = "Download Latest Version";
         sItem.onSelect = function () {
             menuitem6OnClick();
         };
         mItem.appendChild(sItem);
 
         sItem = new MenuItem();
         sItem.title = "Contact Support";
         sItem.onSelect = function () {
             menuitem7OnClick();
         };
         mItem.appendChild(sItem);
 
         sItem = new MenuItem();
         sItem.title = "Chat about Steampunk Widgets on Facebook";
         sItem.onSelect = function () {
             facebookChat();
         };
         mItem.appendChild(sItem);
      
        mItem = new MenuItem();
        mItem.title = "";
        mItem.onSelect = function() {
            nullfunction();
        };
      	items.push(mItem);
      
        mItem = new MenuItem();
        mItem.title = "Reveal Widget in Windows Explorer";
        mItem.onSelect = function() {
            findWidget();
        };
      	items.push(mItem);
      
        mItem = new MenuItem();
        mItem.title = "";
        mItem.onSelect = function() {
            nullfunction();
        };
      	items.push(mItem);
      
        mItem = new MenuItem();
        mItem.title = "Reload Widget (F5)";
        mItem.onSelect = function () {
            reloadWidget();
        };
      	items.push(mItem);

        if (preferences.imageEditPref.value != "" && debugFlg === "1") {
                mItem = new MenuItem();
                mItem.title = "Edit Widget using " + preferences.imageEditPref.value ;
                mItem.onSelect = function () {
                    editWidget();
                };
                items.push(mItem);
        }
        
      mainWindow.contextMenuItems = items;
	};
}
//=====================
//End function
//=====================

//==============================================================
// this function reloads the widget when preferences are changed
//==============================================================
function changePrefs() {
	log("preferences Changed");

	savePreferences();	/// <<<<<<<<<<<<<
	sleep(1000);
	//startup();			/// <<<<<<<<<<<<<
//	reloadWidget();
}
//=====================
//End function
//=====================

//==============================================================
// this function reloads the widget when preferences are changed
//==============================================================
function settooltip() {
	//if (preferences.tooltipPref.value === "enabled") {
	switchFaces.tooltip = "Press to switch faces";
	prefs.tooltip = "Press to open the widget preferences";
	//} else {
	//		 switchFaces.tooltip = "";
	//}
}
//=====================
//End function
//=====================

//===========================================
// this function shows one face or the other
//===========================================
function showFace() {
	if (preferences.clockFaceSwitchPref.value === "stopwatch") {
		background2.visible = true; //false by default
		background2.opacity = 255;	//using opacity rather than visible property to maintain click-through
		background.visible = false; //dual
		smallHourHand.visible = false;
		smallMinuteHand.visible = false;

		swSecondHand.visible = true;
		swMinuteHand.visible = true;
		swHourHand.visible = true;

		dateText.visible = false;
		secondtextxo = 262;
		secondtextyo = 322;
	} else {
		background2.opacity = 1;	// a widget cannot mouse-through to a layer below so an alternative is to set opacity to 1. This allows
									// us to catch the ctrl+mousewheel event on the alternative face.
		background.visible = true;	//dual
		smallHourHand.visible = true;
		smallMinuteHand.visible = true;

		swSecondHand.visible = false;
		swMinuteHand.visible = false;
		swHourHand.visible = false;

		dateText.visible = true;
		secondtextxo = 325;
		secondtextyo = 210;

		//datetextxo = 527, datetextyo = 414;
	}
	sizeClock();
}
//=====================
//End function
//=====================

//===========================================
// this function sets the face type to display
//===========================================
switchFaces.onMouseDown = function () {
	//print("clockfunction before "+ clockFunction);
	if (stopWatchState === 0) {
		if (preferences.clockFaceSwitchPref.value === "standard") {
			preferences.clockFaceSwitchPref.value = "stopwatch";
		} else {
			preferences.clockFaceSwitchPref.value = "standard";
		}
		if (preferences.soundPref.value !== "disabled") {
			play(till, false);
		}
		showFace();
	} else {
		if (preferences.soundPref.value !== "disabled") {
			play(mistake, false);
		}
	}
};
//=====================
//End function
//=====================

//======================================================================================
// Function to lock the widget
//======================================================================================
function lockWidget() {
	// check for aspect ratio and determine whether it is in portrait or landscape mode
	if (screen.width > screen.height) {
		aspectRatio = "landscape";
	} else {
		aspectRatio = "portrait";
	}
	if (mainWindow.locked) {
		pin.opacity = 1;
		mainWindow.locked = false;

		// check if the widget has a lock for the screen type.
		if (aspectRatio === "landscape") {
			preferences.widgetLockLandscapeModePref.value = "disabled";
		}
		// check if the widget has a lock for the screen type.
		if (aspectRatio === "portrait") {
			preferences.widgetLockPortraitModePref.value = "disabled";
		}
		pin.tooltip = "click me to lock the widget in place";
		//screw2.tooltip="click me to lock the widget in place";
		//paper.tooltip="";
		//woodSurround.tooltip="";
	} else {
		pin.opacity = 255;
		mainWindow.locked = true;

		// check if the widget has a lock for the screen type.
		if (aspectRatio === "landscape") {
			preferences.widgetLockLandscapeModePref.value = "enabled";
			preferences.landscapeHoffsetPref.value = mainWindow.hoffset;
			preferences.landscapeVoffsetPref.value = mainWindow.voffset;
		}
		// check if the widget has a lock for the screen type.
		if (aspectRatio === "portrait") {
			preferences.widgetLockPortraitModePref.value = "enabled";
			preferences.portraitHoffsetPref.value = mainWindow.hoffset;
			preferences.portraitVoffsetPref.value = mainWindow.voffset;
		}
		pin.tooltip = "click me to unlock";

		//screw2.tooltip="click me to unlock";
		//paper.tooltip=woodSurround.tooltip="The widget is currently locked in place - click on the screw to release";

	}
	if (preferences.soundPref.value !== "disabled") {
		play(lock, false);
	}
}
//=====================
//End function
//=====================

//==============================
// unlocks the widget
//==============================
pin.onMouseDown = function () {
	lockWidget();
};
//==============================
//
//==============================

//======================================================================================
// Function to lock the widget on startup
//======================================================================================
function checkLockWidget() {
	// check for aspect ratio and determine whether it is in portrait or landscape mode
	if (screen.width > screen.height) {
		aspectRatio = "landscape";
	} else {
		aspectRatio = "portrait";
	}
	print("aspectRatio " + aspectRatio);
	print("preferences.widgetLockLandscapeModePref.value " + preferences.widgetLockLandscapeModePref.value);
	print("preferences.widgetLockPortraitModePref.value " + preferences.widgetLockPortraitModePref.value);
	// check if the widget has a lock for the screen type.
	if (aspectRatio === "landscape") {
		if (preferences.widgetLockLandscapeModePref.value === "disabled") {
			pin.opacity = 1;
			mainWindow.locked = false;
			// this does not work yet
			pin.tooltip = "click me to lock the widget in place";
			//screw2.tooltip="click me to lock the widget in place";
			return;
		}
		print("checkLockWidget locking in landscape");
		pin.opacity = 255;
		mainWindow.locked = true;
		// check if the widget has a lock for the screen type.
		pin.tooltip = "click me to unlock";
	}
	// check if the widget has a lock for the screen type.
	if (aspectRatio === "portrait") {
		if (preferences.widgetLockPortraitModePref.value === "disabled") {
			pin.opacity = 1;
			mainWindow.locked = false;
			// this does not work yet
			pin.tooltip = "click me to lock the widget in place";
			//screw2.tooltip="click me to lock the widget in place";
		} else {
			print("checkLockWidget locking in portrait");
			pin.opacity = 255;
			mainWindow.locked = true;
			// check if the widget has a lock for the screen type.
			pin.tooltip = "click me to unlock";
		}
	}
}
//=====================
//End function
//=====================


//======================================================================================
// Function to set the tick type
//======================================================================================
tickSwitch.onMouseDown = function ()
{
  if (preferences.tickSwitchPref.value == "tick" ) {
       preferences.tickSwitchPref.value = "continuous";
  } else {
       preferences.tickSwitchPref.value = "tick";
  }
  		if (preferences.soundPref.value !== "disabled") {
			play(lock, false);
		}
  tickSwitch.opacity=255;
}
//=====================
//End function
//=====================



//======================================================================================
// Function to set the tick type
//======================================================================================
tickSwitch.onMouseUp = function ()
{
        tickSwitch.opacity=1;
        updateTime();
}
//=====================
//End function
//=====================

function tankHelpShow() {
    helpWindow.visible = true;
    if (preferences.soundPref.value !== "disabled") {
        play(till, false);
    }
}


tankHelp.onMouseDown = function () {
    helpWindow.visible = false;
    if (preferences.soundPref.value !== "disabled") {
        play(ting, false);
    }
};



//===========================================
// this function edits the widget
//===========================================
function editWidget() {
    //var answer = alert("Editing the widget. Proceed?", "Open Editor", "No Thanks");
    //if (answer === 1) {
        //uses the contents of imageEditPref to initiate your default editor
        performCommand("menu");
    //}

}
//=====================
//End function
//=====================


//=====================
// function to carry out a command
//=====================
function performCommand(method) {
    var answer;
    
    if (method === "menu") {
        runCommandInBg(preferences.imageEditPref.value, "runningTask");
    } else {
        print("method "+method);
        if (system.event.altKey) { // filesystem.open() call
            if (preferences.openFilePref.value === "") {
                answer = alert("This widget has not been assigned an alt+double-click function. You need to open the preferences and select a file to be opened. Do you wish to proceed?", "Open Preferences", "No Thanks");
                if (answer === 1) {
                    showWidgetPreferences();
                }
                return;
            }
            filesystem.open(preferences.openFilePref.value);
        } else { 
            if (preferences.imageCmdPref.value === "") {
                answer = alert("This widget has not been assigned a double-click function. You need to open the preferences and enter a run command for this widget. Do you wish to proceed?", "Open Preferences", "No Thanks");
                if (answer === 1) {
                    showWidgetPreferences();
                }
                return;
            }
                runCommandInBg(preferences.imageCmdPref.value, "runningTask");
        }
    }
}
//=====================
//End function
//=====================

//======================================================================================
// END script functions.js
//======================================================================================
