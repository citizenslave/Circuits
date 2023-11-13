const DigitalLogicJS = {
  componentLibrary: [
    { id: 'INPUT', outputs: [{ id: 'a', o: 'INPUT', }], },
    { id: 'OUTPUT', outputs: [{ id: 'a', o: 'OUTPUT', }], },
    { id: 'NAND', outputs: [{ id: '(ab)\'', o: 'NAND', }], },
  ],

  currentBoard: [],

  clearBoard: () => DigitalLogicJS.currentBoard = [],

  addComponent: (board, componentId) => {
    const component = DigitalLogicJS.componentLibrary.find(c => c.id === componentId);
    board.push({
      id: board.length,
      type: component.id,
      inputMap: {},
      outputs: component.outputs.map(o => ({ id: o.id, o: o.o })),
      boardList: component.boardList && new Array(...component.boardList),
    });
  },

  connectComponents: (board, cO, cI) => {
    const inParts = cI.split(':');
    const inputComponent = board.find(c => c.id === Number.parseInt(inParts[0]));

    inputComponent.inputMap[inParts[1]] = `${cO}`;
  },

  readBoard: (inputMap, board, output = null) => {
    const readOutput = (component, connection, inputsToMap) => {
      const inputRemap = {};

      if (connection.looping) {
        return connection.lastRead;
      } else {
        connection.looping = true;
      }
      
      Object.keys(component.inputMap).forEach(k => {
        const connectionId = component.inputMap[k].split(':');
        const readComponent = board.find(c => c.id === Number.parseInt(connectionId[0]));
        const readConnection = readComponent.outputs.find(o => o.id === connectionId[1]);
        inputRemap[k] = readOutput(readComponent, readConnection, inputsToMap);
        readConnection.lastRead = inputRemap[k];
      });

      connection.looping = false;
      Object.keys(inputsToMap).forEach(k => {
        const inputParts = k.indexOf('/') !== -1 ? k.split('/') : k.split(':');
        if (component.id === Number.parseInt(inputParts[0]) && component.outputs.find(o => o.id === inputParts[1])) inputRemap[inputParts[1]] = inputsToMap[k];
      });
      
      const defaultFunctionMap = { 'INPUT': i => i['a'], 'OUTPUT': i => i['a'], 'NAND': i => !(i['a'] && i['b']), };
      return component.boardList ? DigitalLogicJS.readBoard(inputRemap, component.boardList, connection.o)[0][0].value
        : defaultFunctionMap[connection.o](inputRemap);
    };

    if (output) output = output.split(':');
    const outputComponents = board.filter(c => (!output && c.type === 'OUTPUT') || (output && c.id === Number.parseInt(output[0])));

    const results = outputComponents.map(o => o.outputs.filter(v => !output || v.id === output[1])
      .map(v => ({ id: `${o.id}:${v.id}`, value: readOutput(o, v, inputMap) })));
    return results;
  },

  saveComponent: (board, name) => {
    const inputs = board.filter(c => c.type === 'INPUT').map(c => c.outputs.map(o => `${c.id}/${o.id}`)).flat();

    const outputComponents = board.filter(c => c.type === 'OUTPUT');  
    const outputs = outputComponents.map(c => c.outputs.map(o => ({ id: `${c.id}/${o.id}`, o: `${c.id}:${o.id}` }))).flat();

    DigitalLogicJS.componentLibrary.push({
      id: name,
      boardList: board.map(c => c.boardList ? c : { ...c, outputs: c.outputs.map(o => ({ id: o.id, o: c.type })) }),
      inputs,
      outputs,
    });
  },

  runTruthTwo: () => {
    console.log(DigitalLogicJS.readBoard({ '0:a': false, '1:a': false }, DigitalLogicJS.currentBoard)[0][0]);
    console.log(DigitalLogicJS.readBoard({ '0:a': true, '1:a': false }, DigitalLogicJS.currentBoard)[0][0]);
    console.log(DigitalLogicJS.readBoard({ '0:a': false, '1:a': true }, DigitalLogicJS.currentBoard)[0][0]);
    console.log(DigitalLogicJS.readBoard({ '0:a': true, '1:a': true }, DigitalLogicJS.currentBoard)[0][0]);
  },

  serializeLibrary: () => JSON.stringify(DigitalLogicJS.componentLibrary.filter(c => c.boardList)),
  loadLibrary: json => DigitalLogicJS.componentLibrary = [ ...DigitalLogicJS.componentLibrary, ...JSON.parse(json) ]
};

//////

console.log('Access "DigitalLogicJS" to begin!');



// SR Latch (NAND Gates Only)
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'INPUT');  // 0
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'INPUT');  // 1
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NAND');   // 2
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NAND');   // 3
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NAND');   // 4
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NAND');   // 5
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'OUTPUT'); // 6

// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '0:a', '2:a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '0:a', '2:b');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '1:a', '3:a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '1:a', '3:b');

// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '2:(ab)\'', '4:a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '4:(ab)\'', '5:a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '5:(ab)\'', '4:b');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '3:(ab)\'', '5:b');

// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '5:(ab)\'', '6:a');



// DigitalLogicJS.clearBoard();

// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'INPUT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NAND');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'OUTPUT');

// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '0:a', '1:a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '0:a', '1:b');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '1:(ab)\'', '2:a');

// DigitalLogicJS.saveComponent(DigitalLogicJS.currentBoard, 'NOT');
// DigitalLogicJS.clearBoard();



// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'INPUT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NOT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'OUTPUT');

// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '0:a', '1:0/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '1:2/a', '2:a');



// DigitalLogicJS.clearBoard();

// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'INPUT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'INPUT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NAND');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NOT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'OUTPUT');

// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '0:a', '2:a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '1:a', '2:b');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '2:(ab)\'', '3:0/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '3:2/a', '4:a');



// DigitalLogicJS.saveComponent(DigitalLogicJS.currentBoard, 'AND');
// DigitalLogicJS.clearBoard();

// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'INPUT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'INPUT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NOT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NOT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NAND');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'OUTPUT');

// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '0:a', '2:0/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '1:a', '3:0/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '2:2/a', '4:a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '3:2/a', '4:b');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '4:(ab)\'', '5:a');



// DigitalLogicJS.saveComponent(DigitalLogicJS.currentBoard, 'OR');
// DigitalLogicJS.clearBoard();

// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'INPUT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'INPUT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NAND');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'OR');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'AND');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'OUTPUT');

// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '0:a', '2:a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '1:a', '2:b');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '0:a', '3:0/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '1:a', '3:1/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '2:(ab)\'', '4:0/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '3:5/a', '4:1/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '4:4/a', '5:a');



// DigitalLogicJS.saveComponent(DigitalLogicJS.currentBoard, 'XOR');
// DigitalLogicJS.clearBoard();

// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'INPUT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'INPUT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'OR');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NOT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'OUTPUT');

// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '0:a', '2:0/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '1:a', '2:1/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '2:5/a', '3:0/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '3:2/a', '4:a');



// DigitalLogicJS.saveComponent(DigitalLogicJS.currentBoard, 'NOR');
// DigitalLogicJS.clearBoard();

// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'INPUT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'INPUT');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NOR');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'NOR');
// DigitalLogicJS.addComponent(DigitalLogicJS.currentBoard, 'OUTPUT');

// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '0:a', '2:0/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '1:a', '3:1/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '2:4/a', '3:0/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '3:4/a', '2:1/a');
// DigitalLogicJS.connectComponents(DigitalLogicJS.currentBoard, '3:4/a', '4:a');



// const libText = `[{
//   "id":"NOT",
//   "boardList":[{
//     "id":0,
//     "type":"INPUT",
//     "inputMap":{},
//     "outputs":[{"id":"a","o":"INPUT"}],
//     "boardList":null
//   },{
//     "id":1,
//     "type":"NAND",
//     "inputMap":{"a":"0:a","b":"0:a"},
//     "outputs":[{"id":"(ab)'","o":"NAND"}],
//     "boardList":null
//   },{
//     "id":2,
//     "type":"OUTPUT",
//     "inputMap":{"a":"1:(ab)'"},
//     "outputs":[{"id":"a","o":"OUTPUT"}],
//     "boardList":null
//   }],
//   "inputs":["0/a"],
//   "outputs":[{"id":"2/a","o":"2:a"}]
// },{
//   "id":"AND",
//   "boardList":[{
//     "id":0,
//     "type":"INPUT",
//     "inputMap":{},
//     "outputs":[{"id":"a","o":"INPUT"}],
//     "boardList":null
//   },{
//     "id":1,
//     "type":"INPUT",
//     "inputMap":{},
//     "outputs":[{"id":"a","o":"INPUT"}],
//     "boardList":null
//   },{
//     "id":2,
//     "type":"NAND",
//     "inputMap":{"a":"0:a","b":"1:a"},
//     "outputs":[{"id":"(ab)'","o":"NAND"}],
//     "boardList":null
//   },{
//     "id":3,
//     "type":"NOT",
//     "inputMap":{"0/a":"2:(ab)'"},
//     "outputs":[{"id":"2/a","o":"2:a"}],
//     "boardList":[{
//       "id":0,
//       "type":"INPUT",
//       "inputMap":{},
//       "outputs":[{"id":"a","o":"INPUT"}],
//       "boardList":null
//     },{
//       "id":1,
//       "type":"NAND",
//       "inputMap":{"a":"0:a","b":"0:a"},
//       "outputs":[{"id":"(ab)'","o":"NAND"}],
//       "boardList":null
//     },{
//       "id":2,
//       "type":"OUTPUT",
//       "inputMap":{"a":"1:(ab)'"},
//       "outputs":[{"id":"a","o":"OUTPUT"}],
//       "boardList":null
//     }]
//   },{
//     "id":4,
//     "type":"OUTPUT",
//     "inputMap":{"a":"3:2/a"},
//     "outputs":[{"id":"a","o":"OUTPUT"}],
//     "boardList":null
//   }],
//   "inputs":["0/a","1/a"],
//   "outputs":[{"id":"4/a","o":"4:a"}]
// },{
//   "id":"OR",
//   "boardList":[{
//     "id":0,
//     "type":"INPUT",
//     "inputMap":{},
//     "outputs":[{"id":"a","o":"INPUT"}],
//     "boardList":null
//   },{
//     "id":1,
//     "type":"INPUT",
//     "inputMap":{},
//     "outputs":[{"id":"a","o":"INPUT"}],
//     "boardList":null
//   },{
//     "id":2,
//     "type":"NOT",
//     "inputMap":{"0/a":"0:a"},
//     "outputs":[{"id":"2/a","o":"2:a"}],
//     "boardList":[{
//       "id":0,
//       "type":"INPUT",
//       "inputMap":{},
//       "outputs":[{"id":"a","o":"INPUT"}],
//       "boardList":null
//     },{
//       "id":1,
//       "type":"NAND",
//       "inputMap":{"a":"0:a","b":"0:a"},
//       "outputs":[{"id":"(ab)'","o":"NAND"}],
//       "boardList":null
//     },{
//       "id":2,
//       "type":"OUTPUT",
//       "inputMap":{"a":"1:(ab)'"},
//       "outputs":[{"id":"a","o":"OUTPUT"}],
//       "boardList":null
//     }]
//   },{
//     "id":3,
//     "type":"NOT",
//     "inputMap":{"0/a":"1:a"},
//     "outputs":[{"id":"2/a","o":"2:a"}],
//     "boardList":[{
//       "id":0,
//       "type":"INPUT",
//       "inputMap":{},
//       "outputs":[{"id":"a","o":"INPUT"}],
//       "boardList":null
//     },{
//       "id":1,
//       "type":"NAND",
//       "inputMap":{"a":"0:a","b":"0:a"},
//       "outputs":[{"id":"(ab)'","o":"NAND"}],
//       "boardList":null
//     },{
//       "id":2,
//       "type":"OUTPUT",
//       "inputMap":{"a":"1:(ab)'"},
//       "outputs":[{"id":"a","o":"OUTPUT"}],
//       "boardList":null
//     }]
//   },{
//     "id":4,
//     "type":"NAND",
//     "inputMap":{"a":"2:2/a","b":"3:2/a"},
//     "outputs":[{"id":"(ab)'","o":"NAND"}],
//     "boardList":null
//   },{
//     "id":5,
//     "type":"OUTPUT",
//     "inputMap":{"a":"4:(ab)'"},
//     "outputs":[{"id":"a","o":"OUTPUT"}],
//     "boardList":null
//   }],
//   "inputs":["0/a","1/a"],
//   "outputs":[{"id":"5/a","o":"5:a"}]
// }]`;

// DigitalLogicJS.componentLibrary = [ ...DigitalLogicJS.componentLibrary, ...JSON.parse(DigitalLogicJS.libText) ];
