import {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} from 'discord.js';

import {
    withErrorHandling,
    replyUserError,
    ErrorTypes
} from '../../utils/errorHandler.js';

import { getApplicationSettings } from '../../utils/database.js';

export default {

    slashOnly: true,

    data: new SlashCommandBuilder()

        .setName('application-panel')

        .setDescription(
            'Create the staff application panel.'
        )

        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription(
                    'Channel where the panel will be posted.'
                )
                .setRequired(true)
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild
        ),

    category: 'Community',

    execute: withErrorHandling(
        async interaction => {

            const channel =
                interaction.options.getChannel(
                    'channel'
                );

            if (
                !channel ||
                !channel.isTextBased()
            ) {

                return replyUserError(
                    interaction,
                    {
                        type:
                            ErrorTypes.USER_INPUT,

                        message:
                            'Please select a text channel.'
                    }
                );

            }

            const settings =
                await getApplicationSettings(
                    interaction.client,
                    interaction.guild.id
                );

            if (!settings.enabled) {

                return replyUserError(
                    interaction,
                    {
                        type:
                            ErrorTypes.CONFIGURATION,

                        message:
                            'Applications are currently disabled.'
                    }
                );

            }

            const embed =
                new EmbedBuilder()

                    .setTitle(
                        '📋 STAFF APPLICATIONS'
                    )

                    .setDescription(

                        [
                            '## Become Part of Our Team',
                            '',
                            'We are looking for active, mature and dedicated members to join our staff team.',
                            '',
                            '### Before applying',
                            '',
                            '• Make sure you meet the requirements.',
                            '• Answer every question honestly.',
                            '• Give detailed answers.',
                            '• Do not submit multiple applications.',
                            '',
                            '### Application Process',
                            '',
                            '1️⃣ Click **Apply Now**',
                            '2️⃣ Complete the application form',
                            '3️⃣ Staff will review your application',
                            '4️⃣ You will receive the result',
                            '',
                            '**Application Status:** 🟢 OPEN'
                        ].join('\n')
                    )

                    .setFooter({
                        text:
                            `${interaction.guild.name} • Staff Recruitment`
                    })

                    .setTimestamp();

            const row =
                new ActionRowBuilder()
                    .addComponents(

                        new ButtonBuilder()

                            .setCustomId(
                                'application_panel_apply'
                            )

                            .setLabel(
                                'Apply Now'
                            )

                            .setEmoji(
                                '📝'
                            )

                            .setStyle(
                                ButtonStyle.Primary
                            )

                    );

            await channel.send({

                embeds: [
                    embed
                ],

                components: [
                    row
                ]

            });

            return interaction.reply({

                content:
                    `✅ Application panel created in ${channel}.`,

                ephemeral: true

            });

        },

        {
            type: 'command',
            commandName:
                'application-panel'
        }

    )

};
