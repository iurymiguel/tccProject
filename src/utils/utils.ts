export class Utils{

    public static readonly NO_SPACE_REGEX: RegExp = /.*\S/;
    public static readonly PAGES = {
        KANBAN_PAGE: 'KanbanPage',
        HOME_PAGE: 'HomePage',
    }

    /**
     * @description Verifica se um usuário é administrador.
     * @param user objeto contendo os dados do usuário.
     */
    public static isAdmin(user): boolean{
        const adminSubstring: string = 'jira-admin';
        try{
            const userGroups: any[] = user.groups.items;
            const isAdmin = userGroups.filter((item) => {
                if(item.name){
                    const name: string = item.name;
                    return (name.indexOf(adminSubstring) > -1);
                }
                return false;
            });
            return (isAdmin.length > 0);
        }catch(e){
            return false;
        }
    }
}