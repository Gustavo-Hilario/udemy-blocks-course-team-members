import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Icon } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function SortableItem( props ) {
	const { attributes, listeners, setNodeRef, transform, transition } =
		useSortable( { id: props.id } );

	const style = {
		// stylelint-disable-next-line
		transform: CSS.Transform.toString( transform ),
		transition,
	};

	return (
		<li
			ref={ setNodeRef }
			style={ style }
			{ ...listeners }
			{ ...attributes }
		>
			<button
				aria-label={ __( 'Edit Social Link', 'team-member' ) }
				onClick={ () => {
					props.setSelectedLink( props.index );
				} }
				className={
					props.selectedLink === props.index ? 'is-selected' : null
				}
			>
				<Icon icon={ props.icon } />
			</button>
		</li>
	);
}
