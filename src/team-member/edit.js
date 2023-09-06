import { __ } from '@wordpress/i18n';

import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
} from '@wordpress/block-editor';

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
			<MediaPlaceholder
				accept="image/*"
				allowedTypes={ [ 'image' ] }
				icon="admin-users"
				labels={ { title: __( 'The Image' ) } }
				multiple={ false }
				onSelect={ ( el ) => {
					//eslint-disable-next-line
					console.log( el );
				} }
				onSelectURL={ ( url ) => {
					//eslint-disable-next-line
					console.log( url );
				} }
				onError={ ( error ) => {
					//eslint-disable-next-line
					console.log( error );
				} }
			/>
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
