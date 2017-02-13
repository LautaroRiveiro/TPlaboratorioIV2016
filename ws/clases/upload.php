<?php
if ( !empty( $_FILES ) ) {

	#-------------------------------------- REDIMENSIONAR IMAGEN A 600x400 --------------------------------#
	$maxDimW = 600;
	$maxDimH = 400;
	list($width, $height, $type, $attr) = getimagesize( $_FILES['file']['tmp_name'] );
	// if ( $width > $maxDimW || $height > $maxDimH ) {
	    $target_filename = $_FILES['file']['tmp_name'];
	    $fn = $_FILES['file']['tmp_name'];
	 
	    $size = getimagesize( $fn );
	    $ratio = $size[0]/$size[1]; // width/height
	    // if( $ratio > 1) {
	    //     $width = $maxDimW;
	    //     $height = $maxDimH/$ratio;
	    // } else {
	    //     $width = $maxDimW*$ratio;
	    //     $height = $maxDimH;
	    // }
		$width = $maxDimW;
		$height = $maxDimH;
	    $src = imagecreatefromstring(file_get_contents($fn));
	    $dst = imagecreatetruecolor( $width, $height );
	    imagecopyresampled($dst, $src, 0, 0, 0, 0, $width, $height, $size[0], $size[1] );

	    imagejpeg($dst, $target_filename); // adjust format as needed
	#-------------------------------------------------------------------------------------------------------#

    $tempPath = $_FILES[ 'file' ][ 'tmp_name' ];
    // $uploadPath = dirname( __FILE__ ) . DIRECTORY_SEPARATOR . 'img' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
    $uploadPath = "../". DIRECTORY_SEPARATOR . 'img' . DIRECTORY_SEPARATOR . $_FILES[ 'file' ][ 'name' ];
    move_uploaded_file( $tempPath, $uploadPath );
    $answer = array( 'answer' => 'Archivo Cargado!' );
    $json = json_encode( $answer );
    echo $json;
} else {
    echo 'No se cargo el archivo';
}
?>