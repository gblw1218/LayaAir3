#if !defined(SpineVertex_lib)
    #define SpineVertex_lib

#ifdef SPINE_SIMPLE
    uniform vec4 u_SimpleAnimatorParams;
    uniform sampler2D u_SimpleAnimatorTexture;
    uniform float u_SimpleAnimatorTextureSize;

    vec4 getBonePosBake(float FramePos, float boneIndices , float weight , vec2 pos , float offset){
        vec2 uv = vec2(0.0,0.0);
        //float 2 * 4
        float PixelPos = FramePos + boneIndices * 2.0;
        float halfOffset = offset * 0.5;
        float uvoffset = PixelPos / u_SimpleAnimatorTextureSize;

        uv.y = floor(uvoffset) * offset + halfOffset;
        uv.x = mod(PixelPos, u_SimpleAnimatorTextureSize) * offset + halfOffset;
        
        vec4 up = texture2D(u_SimpleAnimatorTexture, uv);
        uv.x += offset;
        vec4 down = texture2D(u_SimpleAnimatorTexture, uv);
        // vec4 up = vec4(1.0,1.0 ,1.0 ,0.0 );
        // vec4 down = vec4( 1.0,1.0 ,1.0 ,0.0 );
        float x = pos.x*up.x + pos.y*up.y +up.z;
        float y = pos.x*down.x + pos.y*down.y +down.z;
        pos.x=x*weight;
        pos.y=y*weight;
        return vec4(pos,0.,1.0);
    }
#endif

#if defined(SPINE_FAST) || defined(SPINE_RB)
    uniform vec4 u_sBone[200];
    vec4 getBonePos(float fboneId,float weight,vec2 pos){
        int boneId=int(fboneId);
        vec4 up= u_sBone[boneId*2];
        vec4 down=u_sBone[boneId*2+1];
        float x = pos.x*up.x + pos.y*up.y +up.z ;
        float y = pos.x*down.x + pos.y*down.y +down.z;
        pos.x=x*weight;
        pos.y=y*weight;
        return vec4(pos,0.,1.0);
    }
#endif

uniform vec2 u_size;
uniform vec4 u_color;


vec4 getSpinePos(){

    #ifdef SPINE_SIMPLE
        #ifdef GPU_INSTANCE
            float currentPixelPos = a_SimpleTextureParams.x + a_SimpleTextureParams.y;
	    #else // GPU_INSTANCE
            float currentPixelPos = u_SimpleAnimatorParams.x + u_SimpleAnimatorParams.y;
	    #endif // GPU_INSTANCE

        float offset = 1.0 / u_SimpleAnimatorTextureSize;

        return getBonePosBake(currentPixelPos,a_BoneId,a_weight,a_position,offset)
        +getBonePosBake(currentPixelPos,a_PosWeightBoneID_2.w,a_PosWeightBoneID_2.z,a_PosWeightBoneID_2.xy,offset)
        +getBonePosBake(currentPixelPos,a_PosWeightBoneID_3.w,a_PosWeightBoneID_3.z,a_PosWeightBoneID_3.xy,offset)
        +getBonePosBake(currentPixelPos,a_PosWeightBoneID_4.w,a_PosWeightBoneID_4.z,a_PosWeightBoneID_4.xy,offset);
    #else
        #ifdef SPINE_FAST
            return getBonePos(a_BoneId,a_weight,a_position)
            +getBonePos(a_PosWeightBoneID_2.w,a_PosWeightBoneID_2.z,a_PosWeightBoneID_2.xy)
            +getBonePos(a_PosWeightBoneID_3.w,a_PosWeightBoneID_3.z,a_PosWeightBoneID_3.xy)
            +getBonePos(a_PosWeightBoneID_4.w,a_PosWeightBoneID_4.z,a_PosWeightBoneID_4.xy);
        #endif
        
        #ifdef SPINE_RB
            return getBonePos(a_BoneId,1.0,a_position);
            //return vec4(pos,0.,1.);
        #endif
    #endif // SPINE_SIMPLE
    //spine Texture
    return vec4(a_position.x,a_position.y,0.,1.);

}

vec4 getScreenPos(vec4 pos){
    #ifdef GPU_INSTANCE
        vec3 down =a_NMatrix_1;
        vec3 up =a_NMatrix_0;
    #else
        vec3 down =u_NMatrix_1;
        vec3 up =u_NMatrix_0;
    #endif
    float x=up.x*pos.x+up.y*pos.y+up.z;
    float y=down.x*pos.x+down.y*pos.y-down.z;
    
    #ifdef CAMERA2D
       vec2 posT= (u_view2D *vec3(x,y,1.0)).xy+u_baseRenderSize2D/2.;
       x = posT.x;
       y = posT.y;
    #endif  
    v_cliped = getClipedInfo(vec2(x,-y));
    return vec4((x/u_baseRenderSize2D.x-0.5)*2.0,(y/u_baseRenderSize2D.y+0.5)*2.0,pos.z,1.0);
}

#endif // SpineVertex_lib