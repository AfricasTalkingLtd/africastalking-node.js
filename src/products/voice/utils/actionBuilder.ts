// import { Action } from './actionBuilder.types';

// export class ActionBuilder {
//   private finalized = false;

//   private xml = '<?xml version="1.0" encoding="UTF-8"?><Response>';

//   public buildAction(action: Action) {
//     const {
//       tag, text, children, attributes,
//     } = action;
//     this.xml += `<${tag}`;

//     Object.keys(attributes).map((key) => {
//       this.xml += ` ${key}="${attributes[key]}"`;
//     });

//     if (Object.keys(children)?.length > 0) {
//       this.xml += '>';

//       Object.keys(children).map((child) => {

//       });

//       this.xml += `</${tag}>`;
//     } else {
//       this.xml += text
//         ? `>${text}</${tag}>`
//         : '/>';
//     }
//   }
// }
