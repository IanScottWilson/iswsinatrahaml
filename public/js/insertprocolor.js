new ProColor({
				mode : 'static',
				parent : 'staticpicker',
				imgPath : 'img/procolor_win_',
				input : 'hex3',
				showInField : true,
				color : '#FF0000',
				outputFormat : '#{RR}{GG}{BB}',
				onChanged : function(pc) {
					$('log').innerHTML = "<b>choose " + pc.color + "</b>";
				},
				onAcceptClick : function(pc) {
					$('log').innerHTML = "<b>done " + pc.color + "</b>";
				},
				onCancelClick : function(pc) {
					$('log').innerHTML = "<b>cancel</b>";
				},
				onCloseButton : function(pc) {
					$('log').innerHTML = "<b>close</b>";
				}
			});