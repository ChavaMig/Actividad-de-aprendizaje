// Backend/src/test/unit/mocks/motos.js

exports.mockMotoArray = [
  { id: 1, modelo: 'Yamaha R1',    marca: 'Yamaha',   año: 2020, tipo: 'Deportiva' },
  { id: 2, modelo: 'Honda CB500',  marca: 'Honda',    año: 2019, tipo: 'Naked'      }
];

exports.mockMotoToCreate = {
  modelo: 'Ducati Monster',
  marca: 'Ducati',
  año: 2022,
  tipo: 'Naked'
};

exports.mockMotoCreated = {
  id: 3,
  modelo: 'Ducati Monster',
  marca: 'Ducati',
  año: 2022,
  tipo: 'Naked'
};
