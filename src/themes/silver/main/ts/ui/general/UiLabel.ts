import { Behaviour, Keying, Replacing, SimpleSpec } from '@ephox/alloy';
import { Arr, Merger } from '@ephox/katamari';

import { UiFactoryBackstageShared } from '../../backstage/Backstage';
import { ComposingConfigs } from '../alien/ComposingConfigs';

export interface UiLabelFoo<I> {
  name: string;
  html: string;
  items?: I[];
}

export const renderUiLabel = (spec: UiLabelFoo<SimpleSpec>, sharedBackstage: UiFactoryBackstageShared): SimpleSpec => {
  return Merger.merge({
    dom: {
      tag: 'label',
      innerHtml: spec.html,
      classes: [ 'tox-label' ].concat(spec.items ? 'tox-label-group' : [])
    },
    behaviours: Behaviour.derive([
      ComposingConfigs.self(),
      Replacing.config({ }),
      Keying.config({
        mode: 'acyclic'
      }),
    ])
  }, spec.items ? {
    components: Arr.map(spec.items, sharedBackstage.interpreter),
  } : { });
};