var rackFunctions = {
    syncScrollsBySide() {
        var states = document.getElementsByClassName('roomStates');
        var scroll = document.getElementById('roomCodes').scrollTop;

        for (let i = 0; i < states.length; i++) {
          states[i].scrollTop = scroll;
        }
      },
      syncScrollsByRack(day) {
        var states = document.getElementsByClassName('roomStates');
        var scroll = document.getElementById(moment(day).format("ddd DD MMMM")).scrollTop;
        
        document.getElementById('roomCodes').scrollTop = scroll;

        for (let i = 0; i < states.length; i++) {
          states[i].scrollTop = scroll;
        }
      }
}

export default rackFunctions