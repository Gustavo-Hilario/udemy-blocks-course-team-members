import { __ } from '@wordpress/i18n';

import { registerBlockType } from '@wordpress/blocks';

registerBlockType( 'blocks-course/team-member', {
	// Similar to what's in the block.json file
	title: __( 'Team Member', 'team-members' ),
	description: __( 'Block showing a single team member', 'team-members' ),
	icon: 'admin-users',
	parent: [ 'blocks-course/team-members' ],
	edit: () => {
		return <div>Team member block</div>;
	},
	save: () => {
		return <div>Team member block</div>;
	},
} );
