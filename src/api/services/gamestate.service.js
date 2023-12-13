/* 

Take commands 

POST /gamestate
header: sessionID
payload : {
“nUpdate”: _int_,
“commands”: [
{“cmd”: ADD,
“val”: _list_},
{“cmd”: REM,
“num”: _int_}
]
}




if (Hincr nUpdate != "nupdate")
    return error

if commands.length > 5              // validation?
    return error

*/