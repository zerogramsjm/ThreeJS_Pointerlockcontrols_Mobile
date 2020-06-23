import {
	Euler,
	EventDispatcher,
	Vector3
} from "../../../build/three.module.js";

	var mobile 
	mobile = false;
	var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent); 

	var ww = document.body.clientWidth/2;
	var wh = document.body.clientHeight/.2;

	var h = window.innerHeight;

	var PointerLockControls = function ( camera, domElement ) {

		if (isMobile) { mobile = true; } else{	mobile = false; }
		
		if ( domElement === undefined ) {
			console.warn( 'THREE.PointerLockControls: The second parameter "domElement" is now mandatory.' );
			domElement = document.body;
		}

		this.domElement = domElement;
		this.isLocked = false;

		var scope = this;

		var changeEvent = { type: 'change' };
		var lockEvent = { type: 'lock' };
		var unlockEvent = { type: 'unlock' };

		var euler = new Euler( 0, 0, 0, 'YXZ' );

		var PI_2 = Math.PI / 2;
		var PI_2y = Math.PI / 3.8;

		var PI_2_mobile = Math.PI / 9;

		var vec = new Vector3();
		var clientX, clientY;
		var xfromtouch = 0;
		var yfromtouch = 0;
		var lastxpos = 0;
		var lastypos = 0;
		
		function onTouch(){
		}	
		function onTouchMove( e ) {
		  	clientY = e.touches[0].clientY;
		  	clientX = e.touches[0].clientX;
		  	xfromtouch = clientX-ww;
			yfromtouch = clientY-(h-100) ;
			euler.setFromQuaternion( camera.quaternion );
			euler.y = xfromtouch * 0.005;
			euler.x = yfromtouch * 0.005;
			euler.x = Math.max( - PI_2, Math.min( PI_2_mobile, euler.x ) );
			euler.y = Math.max( - PI_2y, Math.min( PI_2y, euler.y ) );
			camera.quaternion.setFromEuler( euler );
			scope.dispatchEvent( changeEvent );
			console.log(yfromtouch);
		};
		function onTouchEnd( e ) {
		};
		function onMouseMove( event ) {
			if ( scope.isLocked === false ) return;
			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
			euler.setFromQuaternion( camera.quaternion );
			euler.y -= movementX * 0.002;
			euler.x -= movementY * 0.002;
			euler.x = Math.max( - PI_2, Math.min( PI_2, euler.x ) );
			euler.y = Math.max( - PI_2y, Math.min( PI_2y, euler.y ) );
			camera.quaternion.setFromEuler( euler );
			scope.dispatchEvent( changeEvent );
		}

		function onPointerlockChange() {
			if ( document.pointerLockElement === scope.domElement ) {
				scope.dispatchEvent( lockEvent );
				scope.isLocked = true;
			} else {
				scope.dispatchEvent( unlockEvent );
				scope.isLocked = false;
			}
		}

		function onPointerlockError() {
			console.error( 'THREE.PointerLockControls: Unable to use Pointer Lock API' );
		}

		this.connect = function () {
			document.addEventListener( 'mousemove', onMouseMove, false );
			document.addEventListener( 'touchstart', onTouch, false );
			document.addEventListener( 'touchmove', onTouchMove, false);
			document.addEventListener( 'pointerlockchange', onPointerlockChange, false );
			document.addEventListener( 'pointerlockerror', onPointerlockError, false );
		};

		this.disconnect = function () {
			document.removeEventListener( 'mousemove', onMouseMove, false );
			document.removeEventListener( 'touchend', onTouchEnd, false );
			document.removeEventListener( 'touchmove', onTouchmove, false);
			document.removeEventListener( 'pointerlockchange', onPointerlockChange, false );
			document.removeEventListener( 'pointerlockerror', onPointerlockError, false );
		};

		this.dispose = function () {
			this.disconnect();
		};

		this.getObject = function () { // retaining this method for backward compatibility
			return camera;
		};

		this.getDirection = function () {
			var direction = new Vector3( 0, 0, - 1 );
			return function ( v ) {
				return v.copy( direction ).applyQuaternion( camera.quaternion );
			};
		}();

		this.moveForward = function ( distance ) {
			vec.setFromMatrixColumn( camera.matrix, 0 );
			vec.crossVectors( camera.up, vec );
			camera.position.addScaledVector( vec, distance );
		};

		this.moveRight = function ( distance ) {
			vec.setFromMatrixColumn( camera.matrix, 0 );
			camera.position.addScaledVector( vec, distance );
		};
			
			if (mobile == true) {
				this.lock = function () {
					scope.isLocked = true;
					this.connect();
				};
			}
			else{
				this.lock = function () {
					this.domElement.requestPointerLock();
				};
			}

		this.unlock = function () {
			document.exitPointerLock();
		};
		this.connect();
	};

PointerLockControls.prototype = Object.create( EventDispatcher.prototype );
PointerLockControls.prototype.constructor = PointerLockControls;

export { PointerLockControls };
