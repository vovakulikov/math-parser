import { createNonTerminal, createTerminal } from "./types";

enum OperationType {
  unary,
  binary,
  // TODO [VK] May will be usefully
  ternary
}

export default [
  {
    left: createNonTerminal('S'),
    products: [
      { type: OperationType.unary, rule: [createTerminal('-'), createNonTerminal('B')] }
    ],
  },
  {
    left: createNonTerminal('B'),
    products: [
      { type: OperationType.unary, rule: [createNonTerminal('T') ] },
      {
        type: OperationType.binary,
        rule: [
          createNonTerminal('B'),
          createTerminal('&'),
          createNonTerminal('T'),
        ],
      }
    ],
  },
  {
    left: createNonTerminal('T'),
    products: [
      { type: OperationType.unary, rule: [createNonTerminal('J') ] },
      {
        type: OperationType.unary,
        rule: [
          createNonTerminal('T'),
          createTerminal('^'),
          createNonTerminal('J'),
        ],
      }
    ],
  },
  {
    left: createNonTerminal('J'),
    products: [
      {
        type: OperationType.unary,
        rule: [
          createTerminal('('),
          createNonTerminal('B'),
          createTerminal(')'),
        ]
      },
      { type: OperationType.unary, rule: [ createTerminal('p') ] }
    ],
  },
];
