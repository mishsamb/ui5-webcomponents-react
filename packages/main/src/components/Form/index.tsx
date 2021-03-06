import { createComponentStyles } from '@ui5/webcomponents-react-base/lib/createComponentStyles';
import { usePassThroughHtmlProps } from '@ui5/webcomponents-react-base/lib/usePassThroughHtmlProps';
import { useViewportRange } from '@ui5/webcomponents-react-base/lib/useViewportRange';
import { CurrentViewportRangeContext } from '@ui5/webcomponents-react/lib/CurrentViewportRangeContext';
import { FormGroup } from '@ui5/webcomponents-react/lib/FormGroup';
import { Grid } from '@ui5/webcomponents-react/lib/Grid';
import { Title } from '@ui5/webcomponents-react/lib/Title';
import { TitleLevel } from '@ui5/webcomponents-react/lib/TitleLevel';
import React, { FC, forwardRef, ReactElement, Ref, useMemo } from 'react';
import { CommonProps } from '../../interfaces/CommonProps';
import { styles } from './Form.jss';

export interface FormPropTypes extends CommonProps {
  /**
   * Components that are placed into Form.
   */
  children: ReactElement<unknown> | Array<ReactElement<unknown>>;
  /**
   * Form title
   */
  title?: string;
}

const useStyles = createComponentStyles(styles, { name: 'Form' });

/**
 * <code>import { Form } from '@ui5/webcomponents-react/lib/Form';</code>
 */
const Form: FC<FormPropTypes> = forwardRef((props: FormPropTypes, ref: Ref<HTMLDivElement>) => {
  const { title, children, className, slot, style, tooltip } = props;

  const classes = useStyles();
  const currentRange = useViewportRange('StdExt');

  const [formGroups, updatedTitle] = useMemo(() => {
    let formGroups: any;
    let updatedTitle: string = title;

    // check if ungrouped FormItems exist amongst the Form's children and put them into an artificial FormGroup
    if (Array.isArray(children)) {
      const ungroupedItems = [];
      formGroups = [];
      children.forEach((child: any) => {
        if (child.type.displayName === 'FormItem') {
          ungroupedItems.push(child);
        } else if (child.type.displayName === 'FormGroup') {
          formGroups.push(child as ReactElement);
        }
      });

      if (ungroupedItems.length > 0) {
        formGroups.push(<FormGroup>{ungroupedItems}</FormGroup>);
      }
    } else {
      // check if a sole Form's group has a Title and take it as Form Title if one does not exist
      const childProps = (children as ReactElement).props;
      if ((!title || title.length === 0) && childProps.title && childProps.title.length > 0) {
        updatedTitle = childProps.title;
        formGroups = React.cloneElement(children as ReactElement, { title: null });
      } else {
        formGroups = children;
      }
    }

    return [formGroups, updatedTitle];
  }, [children]);

  const passThroughProps = usePassThroughHtmlProps(props);

  return (
    <CurrentViewportRangeContext.Provider value={currentRange}>
      {updatedTitle && (
        <Title level={TitleLevel.H3} className={classes.formTitle}>
          {updatedTitle}
        </Title>
      )}
      <Grid
        ref={ref}
        defaultSpan={'XL6 L12 M12 S12'}
        className={className}
        slot={slot}
        style={style}
        tooltip={tooltip}
        {...passThroughProps}
      >
        {formGroups}
      </Grid>
    </CurrentViewportRangeContext.Provider>
  );
});

Form.displayName = 'Form';

export { Form };
