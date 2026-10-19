<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns="http://www.w3.org/1999/xhtml"
    version="1.0">

    <xsl:output method="xml" omit-xml-declaration="yes"/>

    <xsl:template name="separator">
        <div class="aband-sep"/>
    </xsl:template>


    <xsl:template name="metadata-item">
        <xsl:param name="label"/>
        <xsl:param name="value"/>
        <xsl:param name="field"/>
        <xsl:if test="string($value) != ''">
            <div class="aband-meta-item">
                <div class="aband-meta-label" data-label="{$field}">
                    <xsl:if test="$field = 'estimated-time'">
                        <span class="aband-icon" data-icon="estimated-time" aria-hidden="true" hidden="hidden"/>
                    </xsl:if>
                    <span class="aband-label-text"><xsl:value-of select="$label"/></span>
                </div>
                <div class="aband-meta-value">
                    <span class="aband-value-text"><xsl:value-of select="$value"/></span>
                </div>
            </div>
        </xsl:if>
    </xsl:template>

    <xsl:template match="/">
        <xsl:variable name="band" select="/*"/>
        <xsl:variable name="extended" select="string($band/@deadline-extension-at) != ''"/>
        <xsl:variable name="policy" select="string($band/@ai-policy)"/>
        <xsl:variable name="difficulty" select="string($band/@difficulty)"/>

        <div class="ck-assignment-band assignment-band" aria-label="Assignment information">
            <div class="aband-strip" role="button" tabindex="0" aria-expanded="false" aria-controls="ck-assignment-band-details">
                <span class="aband-strip-items" aria-live="off">
                    <xsl:if test="$band/@open != ''">
                        <div class="aband-item">
                            <span class="aband-item-label">Opens</span>
                            <span class="aband-item-value" data-date="open"><xsl:value-of select="$band/@open"/></span>
                        </div>
                        <xsl:call-template name="separator"/>
                    </xsl:if>

                    <div class="aband-item">
                        <span class="aband-item-label aband-icon-text aband-deadline-label" data-deadline-type="{$band/@deadline-type}">
                            <span class="aband-icon" data-icon="deadline-{$band/@deadline-type}" aria-hidden="true" hidden="hidden"/>
                            <span class="aband-label-text">
                                <xsl:value-of select="$band/@deadline-type"/>
                                <xsl:text> Deadline</xsl:text>
                            </span>
                        </span>
                        <span data-date="deadline-at">
                            <xsl:attribute name="class">
                                <xsl:text>aband-item-value</xsl:text>
                                <xsl:if test="$extended"><xsl:text> aband-struck</xsl:text></xsl:if>
                            </xsl:attribute>
                            <xsl:value-of select="$band/@deadline-at"/>
                        </span>
                        <xsl:if test="$extended">
                            <span class="aband-ext-date" data-date="deadline-extension-at"><xsl:value-of select="$band/@deadline-extension-at"/></span>
                            <xsl:if test="$band/@deadline-extension-reason != ''">
                                <span class="aband-ext-reason">(<xsl:value-of select="$band/@deadline-extension-reason"/>)</span>
                            </xsl:if>
                        </xsl:if>
                    </div>
                    <xsl:call-template name="separator"/>

                    <div class="aband-item aband-item-progress">
                        <div class="aband-progress">
                            <div class="aband-progress-track">
                                <div class="aband-progress-fill aband-fill-ok"/>
                            </div>
                            <span class="aband-progress-label" role="timer" aria-label="Time remaining"/>
                        </div>
                    </div>

                    <xsl:if test="$band/@submission-type != ''">
                        <xsl:call-template name="separator"/>
                        <div class="aband-item">
                            <span class="aband-badge aband-badge-sub" data-submission-type="{$band/@submission-type}">
                                <span class="aband-icon" data-icon="submission-{$band/@submission-type}" aria-hidden="true" hidden="hidden"/>
                                <xsl:choose>
                                    <xsl:when test="$band/@submission-type = 'group'">
                                        <xsl:text>Group</xsl:text>
                                        <xsl:if test="$band/@submission-group-size != ''">
                                            <xsl:text> (</xsl:text>
                                            <xsl:value-of select="$band/@submission-group-size"/>
                                            <xsl:text>)</xsl:text>
                                        </xsl:if>
                                    </xsl:when>
                                    <xsl:otherwise>Individual</xsl:otherwise>
                                </xsl:choose>
                            </span>
                        </div>
                    </xsl:if>

                    <xsl:if test="$policy != ''">
                        <xsl:call-template name="separator"/>
                        <div class="aband-item">
                            <span class="aband-badge aband-badge-ai" data-ai-policy="{$policy}">
                                <span class="aband-icon" data-icon="ai-{$policy}" aria-hidden="true" hidden="hidden"/>
                                <xsl:text>AI: </xsl:text>
                                <xsl:choose>
                                    <xsl:when test="$policy = 'unrestricted'">Unrestricted</xsl:when>
                                    <xsl:when test="$policy = 'restricted'">Restricted</xsl:when>
                                    <xsl:when test="$policy = 'forbidden'">Forbidden</xsl:when>
                                    <xsl:when test="$policy = 'default'">Default policy</xsl:when>
                                    <xsl:otherwise>
                                        <xsl:value-of select="$policy"/>
                                    </xsl:otherwise>
                                </xsl:choose>
                            </span>
                        </div>
                    </xsl:if>
                </span>
                <span class="aband-expand-hint" aria-hidden="true">Details <span class="aband-icon" data-icon="expand" aria-hidden="true" hidden="hidden"/></span>
            </div>

            <div class="aband-panel" id="ck-assignment-band-details" aria-hidden="true">
                <div class="aband-panel-inner">
                    <xsl:if test="$band/*">
                        <div class="aband-meta-item">
                            <div class="aband-meta-label" data-label="learning-outcomes">
                                <span class="aband-label-text">Learning Outcomes</span>
                            </div>
                            <div class="aband-meta-value aband-lo-list">
                                <ck-children/>
                            </div>
                        </div>
                    </xsl:if>

                    <xsl:call-template name="metadata-item">
                        <xsl:with-param name="label" select="'Est. Time'"/>
                        <xsl:with-param name="field" select="'estimated-time'"/>
                        <xsl:with-param name="value" select="$band/@estimated-time"/>
                    </xsl:call-template>
                    <xsl:if test="$band/@difficulty != ''">
                        <div class="aband-meta-item">
                            <div class="aband-meta-label" data-label="difficulty"><span class="aband-label-text">Difficulty</span></div>
                            <div class="aband-meta-value aband-difficulty" data-difficulty="{$difficulty}">
                                <span class="aband-icon" data-icon="difficulty-{$difficulty}" aria-hidden="true" hidden="hidden"/>
                                <span class="aband-value-text">
                                    <xsl:choose>
                                        <xsl:when test="$difficulty = 'easy'">Easy</xsl:when>
                                        <xsl:when test="$difficulty = 'medium'">Medium</xsl:when>
                                        <xsl:when test="$difficulty = 'hard'">Hard</xsl:when>
                                        <xsl:otherwise>
                                            <xsl:value-of select="$difficulty"/>
                                        </xsl:otherwise>
                                    </xsl:choose>
                                </span>
                            </div>
                        </div>
                    </xsl:if>
                    <xsl:choose>
                        <xsl:when test="$band/@bonus = 'true'">
                            <div class="aband-meta-item">
                                <div class="aband-meta-label" data-label="bonus"><span class="aband-label-text">Bonus</span></div>
                                <xsl:if test="$band/@weight != ''">
                                    <div class="aband-meta-value">
                                        <span class="aband-badge aband-badge-bonus">
                                            <xsl:text>+</xsl:text>
                                            <xsl:value-of select="$band/@weight"/>
                                            <xsl:text>%</xsl:text>
                                        </span>
                                    </div>
                                </xsl:if>
                            </div>
                        </xsl:when>
                        <xsl:when test="$band/@weight != ''">
                            <div class="aband-meta-item">
                                <div class="aband-meta-label" data-label="weight"><span class="aband-label-text">Weight</span></div>
                                <div class="aband-meta-value">
                                    <span class="aband-value-text">
                                        <xsl:value-of select="$band/@weight"/>
                                        <xsl:text>% of grade</xsl:text>
                                    </span>
                                </div>
                            </div>
                        </xsl:when>
                    </xsl:choose>
                    <xsl:if test="$band/@points != ''">
                        <div class="aband-meta-item">
                            <div class="aband-meta-label" data-label="points"><span class="aband-label-text">Points</span></div>
                            <div class="aband-meta-value">
                                <span class="aband-value-text"><xsl:value-of select="$band/@points"/> pts</span>
                            </div>
                        </div>
                    </xsl:if>
                    <xsl:if test="$band/@rubrics-provided != ''">
                        <div class="aband-meta-item">
                            <div class="aband-meta-label" data-label="rubrics"><span class="aband-label-text">Rubrics</span></div>
                            <div class="aband-meta-value aband-rubrics" data-rubrics-provided="{$band/@rubrics-provided}">
                                <span class="aband-icon" data-icon="rubrics-{$band/@rubrics-provided}" aria-hidden="true" hidden="hidden"/>
                                <span class="aband-value-text">
                                    <xsl:choose>
                                        <xsl:when test="$band/@rubrics-provided = 'true'">Provided</xsl:when>
                                        <xsl:otherwise>Not provided</xsl:otherwise>
                                    </xsl:choose>
                                </span>
                            </div>
                        </div>
                    </xsl:if>
                </div>
            </div>
        </div>
    </xsl:template>
</xsl:stylesheet>
