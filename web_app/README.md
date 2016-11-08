## Server Code

### Overview
This directory contains code to run as a server. The server serves several purposes:

* Receive images sent by the camera, process them with the CV API, and extract the label(s) for discarded supplies.
* Scan a preference card for a given surgery and extract text(maybe).
* Serve webpages to the user:
  * Seeing scanned photos and labels for the current surgery
  * Comparing discarded items versus preference card items for the current surgery (maybe.)
  * Display analytics for items discarded over time, per surgery.

All calls to the server, including internal calls, employ a RESTful HTTP API.

You can find the complete API in `routes.js`

### Pages
`GET /site/cases`

Shows the list of open cases.

`GET /site/cases/caseID`

For a given case:

  * Displays the items from the preference card scanned (maybe).
  * Displays the labels scanned from the items discarded from this case.
  * Displays relevant statistics.

`GET /site/stats`
Displays relevant aggregated statistics.

asdf

### Frontend API
`GET /api/labels`

Returns a JSON object consisting of all labels scanned across all cases.
TODO: Currently, duplicate items will appear as two separate labels.

__Example Response__

```
{
	"labels" : [
		{ 
			"label" : "Safety IV Catheter",
			"cost" : "12",
			"caseID" : 57
		},
		{ 
			"label" : "Tracheostomy Tube Cuffless",
			"cost" : "38",
			"caseID" : 57
		},
		{ 
			"label" : "Safety IV Catheter",
			"cost" : "12",
			"caseID" : 57
		},
		{ 
			"label" : "Transpac IV Monitoring Kit",
			"cost" : "19",
			"caseID" : 61
		},
	]
}
```

`GET /api/labels/caseID`

Returns a JSON object consisting of all labels scanned for the given case ID.
TODO: Currently, duplicate items will appear as two separate labels.

__Example Response__

```
{
	"caseID" : "57",
	"labels" : [
		{ 
			"label" : "Safety IV Catheter",
			"cost" : "12",
			"caseID" : "57"
		},
		{ 
			"label" : "Tracheostomy Tube Cuffless",
			"cost" : "38",
			"caseID" : "57"
		}
	]
}
```


### Backend API
TODO