import { __ } from '@wordpress/i18n';

import { useEffect, useState } from '@wordpress/element';

import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
} from '@wordpress/block-editor';

import { isBlobURL, revokeBlobURL } from '@wordpress/blob';

import { Spinner, withNotices } from '@wordpress/components';

function Edit( { attributes, setAttributes, noticeOperations, noticeUI } ) {
	const { name, bio, url, alt, id } = attributes;

	const [ blobURL, setBlobURL ] = useState();

	// Check if is there any saved blob URL
	useEffect( () => {
		// console.log( 'Loading for the first tiem' );
		if ( ! id && isBlobURL( url ) ) {
			setAttributes( { url: undefined, alt: '' } );
		}
	}, [] );

	// Free space if the url is a blob URL → Check if URL is a blog URL after reloading
	useEffect( () => {
		if ( isBlobURL( url ) ) {
			setBlobURL( url );
		} else {
			revokeBlobURL( blobURL );
			setBlobURL( undefined );
		}
	}, [ url ] );

	const onChangeName = ( newName ) => {
		setAttributes( { name: newName } );
	};

	const onChangeBio = ( newBio ) => {
		setAttributes( { bio: newBio } );
	};

	const onSelectImage = ( image ) => {
		if ( ! image || ! image.url ) {
			setAttributes( { url: undefined, id: undefined, alt: '' } );
			return;
		}
		setAttributes( {
			id: image.id,
			url: image.url,
			alt: image.alt,
		} );
	};

	const onImageSelectURL = ( newURL ) => {
		setAttributes( { url: newURL, id: undefined, alt: '' } );
	};

	const onUploadError = ( message ) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	};

	return (
		<>
			<BlockControls group="inline">
				<MediaReplaceFlow
					name={ __( 'Replace Image', 'team-members' ) }
					accept="image/*"
					allowedTypes={ [ 'image' ] }
					mediaURL={ url }
					mediaID={ id }
					onSelect={ onSelectImage }
					onSelectURL={ onImageSelectURL }
					onError={ onUploadError }
				/>
			</BlockControls>
			<div { ...useBlockProps() }>
				{ url && (
					<div
						className={ `block-team-member-img${
							isBlobURL( url ) ? ' is-loading' : ''
						} ` }
					>
						<img src={ url } alt={ alt } />
						{ isBlobURL( url ) && <Spinner /> }
					</div>
				) }
				<MediaPlaceholder
					accept="image/*"
					allowedTypes={ [ 'image' ] }
					disableMediaButtons={ url }
					icon="admin-users"
					labels={ { title: __( 'The Image' ) } }
					multiple={ false }
					onSelect={ onSelectImage }
					onSelectURL={ onImageSelectURL }
					onError={ onUploadError }
					notices={ noticeUI }
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
		</>
	);
}

export default withNotices( Edit );
