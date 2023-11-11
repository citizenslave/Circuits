const componentLibrary = [
  {
    id: 'INPUT',
    outputs: [{
      id: 'a',
      f: i => i['a'],
    }],
    boardList: null,
  }, {
    id: 'OUTPUT',
    outputs: [{
      id: 'a',
      f: i => i['a'],
    }],
    boardList: null,
  }, {
    id: 'NAND',
    outputs: [{
      id: '(ab)\'',
      f: i => !(i['a'] && i['b']),
    }],
    boardList: null,
  },
];



let currentBoard = [];

const clearBoard = () => currentBoard = [];

const addComponent = (board, componentId) => {
  const component = componentLibrary.find(c => c.id === componentId);
  board.push({
    id: board.length,
    type: componentId,
    inputMap: {},
    outputs: component.outputs,
    boardList: component.boardList ? new Array(...component.boardList) : null,
  });
};

const connectComponents = (board, cO, cI) => {
  const inParts = cI.split(':');
  const inputComponent = board.find(c => c.id === Number.parseInt(inParts[0]));

  inputComponent.inputMap[inParts[1]] = `${cO}`;
};

const readBoard = (board, inputMap, output = null) => {
  const remapInputs = (component, connection, inputMap) => {
    const inputRemap = {};
    
    Object.keys(component.inputMap).forEach(k => {
      const connectionId = component.inputMap[k].split(':');
      const readComponent = board.find(c => c.id === Number.parseInt(connectionId[0]));
      inputRemap[k] = remapInputs(readComponent, readComponent.outputs.find(o => o.id === connectionId[1]), inputMap);
    });

    Object.keys(inputMap).forEach(k => {
      const inputParts = k.indexOf('/') !== -1 ? k.split('/') : k.split(':');
      if (component.id === Number.parseInt(inputParts[0]) && component.outputs.find(o => o.id === inputParts[1])) inputRemap[inputParts[1]] = inputMap[k];
    });

    return connection.f(inputRemap);
  };

  if (output) output = output.split(':');
  const outputComponents = board.filter(c => (!output && c.type === 'OUTPUT') || (output && c.id === Number.parseInt(output[0])));

  const results = outputComponents.map(o => o.outputs.filter(i => !output || i.id === output[1]).map(i => ({ id: `${o.id}:${i.id}`, value: remapInputs(o, i, inputMap) })));
  return results.flat();
};

const serializeBoard = (board, name) => {
  const inputs = board.filter(c => c.type === 'INPUT');
  const inputMap = {};
  inputs.forEach(i => {
    i.outputs.forEach(v => inputMap[`${i.id}/${v.id}`] = `${i.id}:${v.id}`);
  });

  const outputs = [];
  const outputComponents = board.filter(c => c.type === 'OUTPUT');  
  outputComponents.forEach(o => {
    o.outputs.forEach(v => outputs.push({ id: `${o.id}/${v.id}`, f: i => readBoard(board, i, `${o.id}:${v.id}`)[0].value }));
  });

  componentLibrary.push({
    id: name,
    boardList: new Array(...board),
    inputMap,
    outputs,
  });
};



//////


addComponent(currentBoard, 'INPUT');
addComponent(currentBoard, 'INPUT');
addComponent(currentBoard, 'NAND');
addComponent(currentBoard, 'OR');
addComponent(currentBoard, 'AND');
addComponent(currentBoard, 'OUTPUT');

connectComponents(currentBoard, '0:a', '2:a');
connectComponents(currentBoard, '1:a', '2:b');
connectComponents(currentBoard, '0:a', '3:0/a');
connectComponents(currentBoard, '1:a', '3:1/a');
connectComponents(currentBoard, '2:(ab)\'', '4:0/a');
connectComponents(currentBoard, '3:5/a', '4:1/a');
connectComponents(currentBoard, '4:4/a', '5:a');