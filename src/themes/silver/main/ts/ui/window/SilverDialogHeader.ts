import {
  AlloySpec,
  AlloyTriggers,
  Behaviour,
  Button,
  Container,
  DomFactory,
  Dragging,
  GuiFactory,
  ModalDialog,
  Reflecting,
} from '@ephox/alloy';
import { Option } from '@ephox/katamari';
import { SelectorFind } from '@ephox/sugar';

import { UiFactoryBackstageProviders } from '../../backstage/Backstage';
import { formCancelEvent } from '../general/FormEvents';
import { titleChannel } from './DialogChannels';

export interface WindowHeaderFoo {
  title: string;
  draggable: boolean;
}

const renderClose = (providersBackstage: UiFactoryBackstageProviders) => {
  return Button.sketch({
    dom: {
      tag: 'button',
      classes: ['tox-button', 'tox-button--icon', 'tox-button--naked'],
      attributes: {
        'type': 'button',
        'aria-label': providersBackstage.translate('Close'),
        'title': providersBackstage.translate('Close'), // TODO tooltips: AP-213
      }
    },
    components: [
      {
        dom: {
          tag: 'div',
          classes: ['tox-icon'],
          innerHtml: '<svg width="24" height="24" xmlns="http://www.w3.org/2000/svg"><path d="M17.953 7.453L13.422 12l4.531 4.547-1.406 1.406L12 13.422l-4.547 4.531-1.406-1.406L10.578 12 6.047 7.453l1.406-1.406L12 10.578l4.547-4.531z" fill-rule="evenodd"></path></svg>'
        }
      }
    ],
    action: (comp) => {
      AlloyTriggers.emit(comp, formCancelEvent);
    }
  });
};

const renderTitle = (foo: WindowHeaderFoo, id: Option<string>): AlloySpec => {
  const renderComponents = (data: WindowHeaderFoo) => [
    GuiFactory.text(data.title)
  ];

  return {
    dom: {
      tag: 'div',
      classes: [ 'tox-dialog__title' ],
      attributes: {
        ...id.map((x) => ({id: x}) as {id?: string}).getOr({})
      }
    },
    components: renderComponents(foo),
    behaviours: Behaviour.derive([
      Reflecting.config({
        channel: titleChannel,
        renderComponents
      })
    ])
  };
};

const renderInlineHeader = (foo: WindowHeaderFoo, titleId: string, providersBackstage: UiFactoryBackstageProviders): AlloySpec => {
  return Container.sketch({
    dom: DomFactory.fromHtml('<div class="tox-dialog__header"></div>'),
    components: [
      renderTitle(foo, Option.some(titleId)),
      renderClose(providersBackstage)
    ],
    containerBehaviours: Behaviour.derive([
      Dragging.config({
        mode: 'mouse',
        blockerClass: 'blocker',
        getTarget (handle) {
          return SelectorFind.closest(handle, '[role="dialog"]').getOrDie();
        },
        snaps: {
          getSnapPoints: () => [ ],
          leftAttr: 'data-drag-left',
          topAttr: 'data-drag-top'
        }
      }),
    ])
  });
};

const renderModalHeader = (foo: WindowHeaderFoo, providersBackstage: UiFactoryBackstageProviders): AlloySpec => {
  const pTitle = ModalDialog.parts().title(
    renderTitle(foo, Option.none())
  );

  const pHandle = ModalDialog.parts().draghandle({
    dom: DomFactory.fromHtml('<div class="tox-dialog__draghandle"></div>')
  });

  const pClose = ModalDialog.parts().close(
    renderClose(providersBackstage)
  );

  const components = [ pTitle ].concat(foo.draggable ? [ pHandle ] : []).concat([ pClose ]);
  return Container.sketch({
    dom: DomFactory.fromHtml('<div class="tox-dialog__header"></div>'),
    components
  });
};

export {
  renderInlineHeader,
  renderModalHeader
};