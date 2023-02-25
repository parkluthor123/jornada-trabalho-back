import { prismaClient } from "../configs/prismaClient";
import express from "express";

class ConfigController{
    public async getConfigs(req: express.Request, res: express.Response){
        try {
            const configs = await prismaClient.config.findMany({
                include:{
                    DaysWeek: true,
                },
            });
            return res.json(configs);

        } catch (e: any) {
            return res.status(500).json({ message: e.message });
        }
    }

    public async createConfig(req: express.Request, res: express.Response){
        try {
            const { workDayIsActive, workDay, days } = req.body;

            const config = await prismaClient.config.create({
                data: {
                    next_workday: workDay,
                    is_active: workDayIsActive,
                    created_at: new Date(),
                },
                select:{
                    id: true,
                }
            });
            
            
            const daysWeek = await prismaClient.$transaction(days.map((day: any) => {
                return prismaClient.daysWeek.create({
                    data: {
                        day: day.day,
                        initial_date: day.date.initialDate,
                        final_date: day.date.finalDate,
                        Config:{
                            connect:{
                                id: config.id,
                            }
                        },
                    },
                });
            }));

            if(!config || !daysWeek){
                return res.status(500).json({ message: 'Erro ao criar configuração' });
            }
            else{
                return res.json({ message: 'Configuração criada com sucesso' });
            }

        } catch (e: any) {
            return res.status(500).json({ message: e.message });
        }
    }

    public async updateConfig(req: express.Request, res: express.Response){
        const { workDayIsActive, workDay, days } = req.body;
        
        try {
            //limpa a tabela de dias da semana
            await prismaClient.daysWeek.deleteMany();

            //salva os dias da semana atualizados
            const daysWeek = await prismaClient.$transaction(days.map((day: any) => {
                return prismaClient.daysWeek.create({
                    data: {
                        day: day.day,
                        initial_date: day.date.initialDate,
                        final_date: day.date.finalDate,
                        Config:{
                            connect:{
                                id: 1,
                            }
                        },
                    },
                });
            }));

            //atualiza as informações da tabela de configurações
            const config = await prismaClient.config.update({
                where:{
                    id: 1,
                },
                data:{
                    next_workday: workDay,
                    is_active: workDayIsActive,
                    created_at: new Date(),
                },
            });

            if(!config || !daysWeek){
                return res.status(500).json({ message: 'Erro ao atualizar configuração' });
            }else{
                return res.json({ message: 'Configuração atualizada com sucesso' });
            }

        } catch (e: any) {
            return res.status(500).json({ message: e.message });
        }

    }

}

export default new ConfigController();