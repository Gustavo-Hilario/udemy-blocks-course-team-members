import { __ } from '@wordpress/i18n';

import { useBlockProps, RichText } from '@wordpress/block-editor';

export default function Edit( { attributes, setAttributes } ) {
	const { name, bio } = attributes;

	const onChangeName = ( newName ) => {
		setAttributes( { name: newName } );
	};

	const onChangeBio = ( newBio ) => {
		setAttributes( { bio: newBio } );
	};

	return (
		<div { ...useBlockProps() }>
			<RichText
				placeholder={ __( 'Team Member Name', 'team-member' ) }
				tagName="h4"
				className="blocks-course-team-member-name"
				value={ name }
				onChange={ onChangeName }
				allowedFormats={ [] }
			/>
			<RichText
				placeholder={ __( 'Team Member Bio', 'team-member' ) }
				tagName="p"
				className="blocks-course-team-member-bio"
				value={ bio }
				onChange={ onChangeBio }
				allowedFormats={ [] }
			/>
		</div>
	);
}
