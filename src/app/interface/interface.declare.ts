export interface StoryData {
    id: number;
    user:{
        _id: string;
        userName: string;
        avatar: string;
    }
    media:{
        url: string;
        type: string;
    }
    isActive: boolean;
    viewers: {
        _id: string;
    }
  }